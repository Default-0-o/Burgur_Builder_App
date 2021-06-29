My first project , fully wriitten in JS with React.js and its libraries.

Make A burgur !

****NOTE**** :
If you're in Iran or using Iran IP ,definetly change your IP using a vpn.This app is connected to firebase realtime DB which is can't be reached with Iran IP.
Not changing IP will stop you from getting and posting data.





note : to be able to test the database connection and the async logic, connect it to your own database. I used firebase realtime DB.

just in case that it couldn't work with firebase , it's because of the rules ! follow below.

go to rules in firebase realtime database and delete the default and publish this change :

‌
{‌
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


simple instruction : 
first you need to sign up using "Authentication" button, then you can build your burger and complete your contact data form. if done , you can check out your order in "Orders" panel.
