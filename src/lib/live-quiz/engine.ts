// One atomic Redis script owns transitions, deadline checks and scoring across
// all Vercel instances. Redis TIME, never a phone's clock, determines the score.
export const QUIZ_SCRIPT = String.raw`
local key = KEYS[1]
local cmd = cjson.decode(ARGV[1])
local t = redis.call('TIME')
local now = tonumber(t[1]) * 1000 + math.floor(tonumber(t[2]) / 1000)
local function fail(status, message) return cjson.encode({error=message,status=status}) end
local raw = redis.call('GET', key)
local room
local dirty = false
if cmd.action == 'create' then
  if raw then return fail(409, 'Room code already exists. Try again.') end
  room = {code=cmd.code,title=cmd.title,questions=cmd.questions,host=cmd.auth,
    phase='lobby',index=-1,startsAt=0,endsAt=0,expiresAt=now+86400000,
    players={},answers={},capacity=150,revision=0}
  dirty = true
else
  if not raw then return fail(404, 'This room has expired or does not exist. Check the code with your host.') end
  room = cjson.decode(raw)
end
local host = room.host == cmd.auth
local me = room.players[cmd.auth]
if me and me.removed then return fail(403, 'The host removed you from this room.') end
local function countPlayers()
  local n=0
  for _,p in pairs(room.players) do if not p.removed then n=n+1 end end
  return n
end
if cmd.action == 'join' and not me then
  if room.phase ~= 'lobby' then return fail(409, 'This quiz has started. Ask the host to open a new room.') end
  if countPlayers() >= room.capacity then return fail(409, 'This room is full.') end
  for _,p in pairs(room.players) do
    if not p.removed and p.nameKey == cmd.nameKey then return fail(409, 'That name is taken. Add your initials or a number.') end
  end
  me={id=cmd.playerId,name=cmd.name,nameKey=cmd.nameKey,score=0,correct=0,joinedAt=now}
  room.players[cmd.auth]=me
  dirty=true
end
if not host and not me then return fail(401, 'Rejoin this room to continue.') end
if room.phase == 'question' and now >= room.endsAt then
  room.phase='leaderboard'
  dirty=true
end
if cmd.action == 'advance' then
  if not host then return fail(403, 'Only the host can start or advance questions.') end
  if cmd.index ~= room.index then return fail(409, 'The question has already changed. Your screen will refresh.') end
  if room.phase ~= 'lobby' and room.phase ~= 'leaderboard' then return fail(409, 'Wait for this question to finish.') end
  if countPlayers() == 0 then return fail(409, 'Wait for at least one participant to join.') end
  if room.index + 1 >= #room.questions then
    room.phase='finished'
  else
    room.index=room.index+1
    -- Cumulative scores live on players. Old answer receipts are never used
    -- after advancing; retain only this round to bound work on every poll.
    room.answers={}
    room.phase='question'
    room.startsAt=now+5000
    room.endsAt=room.startsAt+15000
  end
  dirty=true
elseif cmd.action == 'end' then
  if not host then return fail(403, 'Only the host can end the quiz.') end
  room.phase='finished'
  dirty=true
elseif cmd.action == 'remove' then
  if not host then return fail(403, 'Only the host can remove participants.') end
  if room.phase ~= 'lobby' then return fail(409, 'Participants can only be removed in the lobby.') end
  for _,p in pairs(room.players) do if p.id == cmd.playerId then p.removed=true end end
  dirty=true
elseif cmd.action == 'answer' then
  if host then return fail(403, 'Join as a participant to answer.') end
  if cmd.index ~= room.index then return fail(409, 'This answer belongs to a different question.') end
  local answerKey=tostring(room.index)..':'..cmd.auth
  if not room.answers[answerKey] then
    if room.phase ~= 'question' or now < room.startsAt or now >= room.endsAt then return fail(409, 'The answer window is closed.') end
    local q=room.questions[room.index+1]
    if type(cmd.option) ~= 'number' or cmd.option ~= math.floor(cmd.option) or cmd.option < 0 or cmd.option >= #q.options then return fail(400, 'Choose one of the available answers.') end
    local correct=cmd.option==q.correctIndex
    local points=0
    if correct then points=math.max(50,math.floor(100-50*(now-room.startsAt)/(room.endsAt-room.startsAt)+0.5)) end
    room.answers[answerKey]={option=cmd.option,points=points,receivedAt=now}
    me.score=me.score+points
    if correct then me.correct=me.correct+1 end
    dirty=true
  end
end
if dirty then
  room.revision=(room.revision or 0)+1
  redis.call('SET',key,cjson.encode(room),'PX',math.max(1,room.expiresAt-now))
end
local phase=room.phase
if phase == 'question' and now < room.startsAt then phase='countdown' end
local reveal=phase=='leaderboard' or phase=='finished'
local standings={}
local players={}
local answered=0
for auth,p in pairs(room.players) do
  if not p.removed then
    table.insert(standings,{id=p.id,name=p.name,score=p.score,correct=p.correct})
    if host and phase=='lobby' then table.insert(players,{id=p.id,name=p.name}) end
    if room.answers[tostring(room.index)..':'..auth] then answered=answered+1 end
  end
end
table.sort(standings,function(a,b)
  if a.score ~= b.score then return a.score>b.score end
  return a.id<b.id
end)
local mine=cjson.null
local previousScore=-1
local rank=0
for i,p in ipairs(standings) do
  if p.score ~= previousScore then rank=i end
  p.rank=rank
  previousScore=p.score
  if me and p.id==me.id then
    local a=room.answers[tostring(room.index)..':'..cmd.auth]
    mine={id=p.id,name=p.name,score=p.score,correct=p.correct,rank=p.rank,
      answer=a and a.option or cjson.null,points=reveal and a and a.points or cjson.null}
    -- Do not expose whether an answer was correct before the deadline.
    if not reveal and a then
      mine.score=mine.score-a.points
      if a.points>0 then mine.correct=mine.correct-1 end
      mine.rank=cjson.null
    end
  end
end
local question=cjson.null
if room.index>=0 and phase~='countdown' then
  local q=room.questions[room.index+1]
  question={id=q.id,question=q.question,options=q.options}
  if reveal then question.correctIndex=q.correctIndex;question.explanation=q.explanation end
end
local visibleStandings={}
if reveal then
  local limit=cmd.action=='export' and host and #standings or math.min(10,#standings)
  for i=1,limit do table.insert(visibleStandings,standings[i]) end
end
return cjson.encode({code=room.code,title=room.title,phase=phase,serverNow=now,revision=room.revision or 0,
  expiresAt=room.expiresAt,index=room.index,total=#room.questions,startsAt=room.startsAt,
  endsAt=room.endsAt,duration=room.endsAt>room.startsAt and room.endsAt-room.startsAt or 15000,count=countPlayers(),capacity=room.capacity,
  answered=answered,isHost=host,question=question,standings=visibleStandings,players=players,me=mine})
`;

export const RATE_LIMIT_SCRIPT = String.raw`
local n=redis.call('INCR',KEYS[1])
if n==1 then redis.call('EXPIRE',KEYS[1],60) end
return n
`;
