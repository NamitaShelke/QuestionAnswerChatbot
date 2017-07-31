# Project Title
## Simple Question Answer Chatbot 

### Prerequisites and Installation
Install Node.js uing npm

Install ElasticSearch

#### Modules
Install npm elasticsearch client 


### Deployment Steps

1. Create ES Index .
Go to Module "Indexing" and run 
```
./mapping.sh
```
2. Upload Test Data

3.Run server.js from Server Module
```
node server.js
```

Open browser and type

```
localhost:3001/
```

### Technical Approach
#### Communication between Client and Server
1. Used Socket IO for polling Server . If AJAX is used then client will continously try to pull data from Server .
Socket io establishes persistent connection and enables real-time bidirectional event-based communication.

#### While storing data
1. ES Concpet: Apply lowercase tokenizer for question Field . So that even if Capital words entered , there is a match

2. ES Concept: Make no Index for "answer" Filed if You will never be searching with "answer" . This will help in reducing size of Index. It will help when there is huge sclae data.

#### While Searching 
There were many ways of searching.
1. We can query two times . First query on "question" Field to see if it is a direct match ; if not, then we can search in "tags" Field for Indirect match .
But this takes 2 roundTrip => network latency 
* Therefore not used this approach

2. Query on "question" Field and "tag" Field directly.
But how to differentiate if its direct match or indirect match?
=> Use Boosting Concpet.
(a) Multi-Field Search in "question" and "tgs" Field
(b) Boost "question" Field by factor 10 and "tags" Field by factor 0.5. This way we can ensure if user-question exactly matches with ES  question field , its on top.
[Remove stop words , then searchbin tags Field , bcoz it will not contain stop words and we make search faster => not Done ]
(c) Check if response's first hit question string matches exactly with user-question string . 
if yes then it belongs to case "direct match" and send only first hit data. 
If no exact match => then send all hits data
If 0 hits => send default answer ["I dont know"]

### Future Work
#### How to find tags 
* Remove stop words
or
* Can use POS tagger algo to find proper noun in "question" (and/or answer ) Field and store in ES

#### Data Partitioning while Indexing
1. If it is user-specific QA round , can store separate index for each user and use custom routing while indexing documents. So that question and answers belonging to same user are stored together. This makes faster searching time.

#### Searching 
1. Remove stop words from user Question string before searching in "Tag" field
















