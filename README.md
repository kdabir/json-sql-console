# json-sql-console

Query json like a pro

---

![image](https://user-images.githubusercontent.com/735240/31587511-917b035e-b200-11e7-92e2-2428acfaf9b9.png)

* json data from https://www.sitepoint.com/colors-json-example/


Example query:

```SQL
  select color, code->hex 
  from ?
  where type = 'primary'
```

## developing

npm start

## build

npm build

## deploy 

netlify deploy



---

## About

Built using React, Ace, Alasql

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find the most recent version of the guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).


