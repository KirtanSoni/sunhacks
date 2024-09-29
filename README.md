# CodeVis- Code Flow Visualiser
CodeVis is an online tool that allows you to visualise the flow of your code using Mermaid.

![image](https://github.com/user-attachments/assets/188b32f5-bcd9-4da8-81c9-adcae530cdc8)

![image](https://github.com/user-attachments/assets/1841b788-502f-4241-ae94-6e8b9eda0205)

## How to run:
clone the repo:
```
git clone 
```
### Running the client:
cd into the client dir(from the root):
```
cd ./client/vis-client
```
install the dependancies
```
npm install
```
run the react app
```
npm start
```
### Running the server:
cd into the server dir(from the root):
```
cd ./server
```
build the dockerfile:
```
docker build -t server .
```
run docker image
```
docker run -p 8080:8000 server
```
