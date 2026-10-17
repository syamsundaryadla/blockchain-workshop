# Workshop architecture

```mermaid
flowchart TD
 Content[44 beginner lessons and six chapters] --> Deck[Title / About me / Concepts from slide 3]
 Content --> Activities[Predictions, reveals and presenter notes]
 Content --> Labs[Five interactive experiments]
 Labs --> Crypto[Real SHA-256 and temporary ECDSA keys]
 Labs --> Models[Labeled chain, Fabric flow and credits models]
 Practical[Student steps and instructor notes] --> Kit[Student kit and downloads]
 Kit --> Setup[Windows and WSL installation PDF]
 Kit --> Zip[Starter and completed Fabric project]
 Zip --> UI[HTML / CSS / JavaScript interface]
 UI --> Backend[Local Node.js and Fabric Gateway]
 Backend --> Fabric[Org1 peer / Org2 peer / orderer]
 Fabric --> Contract[JavaScript credits contract]
 Contract --> Rules[Three small transfer-rule TODOs]
 Contract --> Tests[Contract tests with stubbed ledger and real certificate parsing]
```

The website's models do not claim to execute Fabric. The separate project uses real Fabric APIs and confirms transfers after valid commit. A full live-network rehearsal remains outstanding until Docker Desktop and Ubuntu integration are running. Earlier Solidity examples and recordings are retained outside the active workshop and are not Fabric evidence.
