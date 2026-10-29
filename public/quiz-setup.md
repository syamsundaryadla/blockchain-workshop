# Live quiz setup — Vercel

The workshop and quiz use the same website. Participants join at `/quiz`; the presenter uses `/quiz/host`. No student account or installation is needed. There are exactly two quizzes: **Morning · Blockchain Foundations (12 questions)** and **Afternoon · Full Syllabus (15 questions)**. Each answer is worth at most **100 points**.

## One-time setup

1. Open the workshop project in your Vercel dashboard.
2. Open Storage / Marketplace and connect an **Upstash Redis** database. Choose a region near your Vercel Functions region and your students. Review the provider's quota before selecting a plan; a paid subscription is not required by this code.
3. In Vercel → Project Settings → Environment Variables, confirm these server-only variables exist for **Production**:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   The Vercel integration's `KV_REST_API_URL` and `KV_REST_API_TOKEN` aliases are also supported.
4. Add `QUIZ_ADMIN_PASSWORD`: a unique private password of at least 8 characters. Keep it to yourself. Do not prefix any of these variables with `NEXT_PUBLIC_`.
5. Redeploy the project so the new environment variables take effect.
6. Visit `https://blockchain.risenine.in/quiz/host`. Enter your host password, select a question set and create a room.
7. Open the join link on a second phone, join, and complete a rehearsal before workshop day. Check Vercel function usage and Redis quota after the rehearsal.

The quiz deliberately stays unavailable until configured; it does not replace missing shared storage with a browser-only simulation.

## Run the quiz

1. Create a room and project the lobby's **QR code**. Scanning it opens the correct room's join page; students only enter their name. The QR is generated locally without a third-party image service. You can also copy the join link or tell students to open `https://blockchain.risenine.in/quiz` and enter the six-digit code.
2. Students enter a name or nickname. Their names and scores appear to the room. Ask them not to enter sensitive personal information.
3. Wait until the expected number has joined. The room allows 150 participants, giving a 100-person workshop headroom. Duplicate names are rejected; students can add initials. You can remove unwanted names before starting.
4. Select **Start quiz**. Each question has a five-second preparation countdown, then a full **20-second answer window**.
5. Students choose one answer. The first accepted answer is final. The server checks the deadline and calculates points.
6. After 20 seconds, the correct answer, explanation and top-ten leaderboard appear automatically. Every participant also sees their own score and rank.
7. Select **Next question** when you are ready. The quiz does not advance while you discuss the answer. After the last leaderboard, select **Finish quiz**.
8. Download **Results CSV** for the complete standings. Rooms expire after 24 hours; export results before then.

Use the same browser to refresh or resume your host session. Its room credential is saved locally; clearing browser storage loses that access. Participants can refresh/reconnect with the same browser after the quiz starts. New participants cannot join once the first question has started. Closing a tab does not remove a participant from the joined count.

## Scoring

Correct answer: `round(100 − 50 × elapsedMilliseconds / 20000)`, between 50 and 100 points. Wrong or missing answer: zero. The elapsed time is measured when Redis receives the answer; the phone cannot choose a timestamp or score. Network latency therefore contributes to response time. Equal total scores share a rank. Retries and repeated clicks cannot score twice.

The countdown is synchronized from server time. Questions and answer keys are not sent before their respective reveal times. Participants should keep the quiz open and use a stable connection. The answer window is enforced by the server even if a phone's clock is wrong or its screen freezes.

## Hosting and capacity

This implementation uses short, uncached requests to Vercel and atomic Redis operations. It does not keep shared game state inside one Vercel Function, require a permanent laptop server, or depend on a long-running socket. Clients refresh approximately every 1.8 seconds in the lobby/results, every 2.5 seconds while answering, and more frequently during the short preparation countdown. The visible timer runs locally. Once finished, background refresh stops.

100 participants is the target, not a hosting SLA. A typical 15-question run with short discussions produces tens of thousands of requests, depending on time spent in the lobby/results. Redis billing may include commands executed inside scripts; check actual usage. Avoid leaving a room open on everyone's phones for the entire day. End it between sessions, and do not run a load test against a paid/live deployment without reviewing its quotas.

Vercel Hobby and Redis limits are separate. Check remaining function invocations, CPU/memory, transfer and database quota. If this is commercial use, check Vercel's Hobby eligibility for your use case. A local concurrency test does not replace a rehearsal on the actual domain, database region and venue Wi-Fi.

## Troubleshooting

- **Not configured:** check the three environment variables and redeploy. Do not put secrets in source files or share them with students.
- **Temporarily unavailable:** inspect Vercel logs and Redis availability/quota. Saved answers remain in Redis; retrying does not award duplicate points.
- **Reconnecting:** keep the page open. It retries automatically. If the question deadline passed, a new answer cannot be accepted.
- **Name is taken:** add initials or a number. Refreshing the same browser resumes the original participant.
- **Host tab closed:** reopen `/quiz/host` in the same browser. It resumes your room.
- **Wrong room on a shared device:** choose Leave room before joining another session. The host should finish a room before creating a replacement.
- **Many phones fail on college Wi-Fi:** try a smaller rehearsal on mobile data. Venue Wi-Fi, captive portals and device power saving can affect synchronization even with adequate server capacity.

## Local development

Copy `.env.example` to `.env.local`, fill it with your development Redis credentials and private host password, then run `npm run dev -- --port 3100`. Keep `.env.local` out of Git. Use a separate development database to avoid affecting workshop rooms.
