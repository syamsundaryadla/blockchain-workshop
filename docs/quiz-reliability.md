# Live quiz reliability check — 30 October 2026

The quiz uses short HTTP polls against a server-authoritative Redis room. It does not use a persistent WebSocket connection. Redis time controls answer deadlines and speed scoring; client clocks cannot extend the answer window.

Changes:
- Stalled state requests time out after four seconds, with a 0.5–3 second reconnect delay and jitter. Returning to the tab or restoring connectivity requests a fresh state.
- Transient answer failures retry once with the same participant, question and choice. Redis accepts only the first answer, including when its acknowledgement was lost.
- Advancing clears previous-round answer receipts. Cumulative scores and correct-answer counts remain on participant records. CSV exports retain final totals; per-question response history is not exported.
- Countdown polling is less frequent, while waiting-room/leaderboard updates are more frequent. Local timer rendering runs four times per second.

Validation used an isolated local Next.js server with real Redis through a local REST bridge. The test admitted 150 participants, submitted 100 simultaneous answers, and kept 100 participants polling during the next round. All checks passed, including scoring, deadline enforcement, duplicate rejection, leaderboard, exports and scores across rounds. There were 1,746 measured state/answer requests; local p95 latency was 892 ms. This is not a measurement of Vercel, Upstash's hosted region, or venue Wi-Fi.

Run `npm run test:quiz` against an isolated configured server with `QUIZ_TEST_URL` and `QUIZ_TEST_PASSWORD`. Remote load tests require `QUIZ_LOAD_TEST_ALLOW_REMOTE=true` because they consume hosted quotas. Never use a room with actual workshop participants for testing.

Before the event, rehearse on the deployed site from the venue network. Confirm host and participant transitions, refresh/rejoin recovery, and a successful answer plus leaderboard. A same-network wired connection for the presenting laptop can reduce Wi-Fi contention.

Mentimeter's official [hosting guide](https://help.mentimeter.com/en/articles/4305015-how-to-host-the-quiz-competition) describes host-started countdowns, result reveals and a quiz WebSocket endpoint. Its [venue guide](https://help.mentimeter.com/en/articles/1382424-get-ready-for-your-in-person-menti) recommends testing both presenter and participant views. These document the comparison; they do not establish equivalent infrastructure or capacity for this app.
