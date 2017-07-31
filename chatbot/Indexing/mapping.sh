curl -X PUT -H "Content-Type: application/json" -d '{

   "settings": {
      "analysis": {
          "analyzer": {
                "tokenAnalyzer": {
                    "type": "custom",
                    "tokenizer": "whitespace",
                    "filter": ["lowercase"]
                }
            }
      }
   },
   "mappings": {
      "questions": {
         "properties": {
            "question": {
               "type": "string",
               "analyzer":  "tokenAnalyzer"
            },
            "answer":{
              "type":"string",
              "index":"no"
            }
         }
      }
   }

}' "http://localhost:9200/qa"
