My first project , fully wriitten in JS with React.js and its libraries.

Make A burgur !



note : to be able to test the database connection and the async logic, connect it to your own database. I used firebase realtime DB.

just in case that it couldn't work with firebase , it's because of the rules ! follow below.

go to rules in firebase realtime database and delete the default and publish this change :
{
  "rules":{ 
  	"Ingredients": {
    	".read": "true",  // 2021-5-7
    	".write": "true",  // 2021-5-7
  	},
    "orders": {
      ".read": "auth != null",  // 2021-5-7
    	".write": "auth != null",  // 2021-5-7
    	".indexOn": ["userId"]
    }
  }
}
