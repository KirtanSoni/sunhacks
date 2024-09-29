from langchain_openai import ChatOpenAI
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.prompts.chat import SystemMessagePromptTemplate
from langchain_core.output_parsers import StrOutputParser
from flask_cors import CORS
import flask
from dotenv import load_dotenv



load_dotenv()
class LLM:
    def __init__(self,llm = ChatOpenAI()):
        self.llm =  llm#ChatOpenAI(temperature = tempereature)
        

    def generate_psudo_code(self,code):
        system_message = "You are a software engineer and you have to write sudo code for the following code {code}"
        prompt = PromptTemplate(template= system_message, input_variables= ["code"])
        sys = SystemMessagePromptTemplate(prompt=prompt)
        message = [sys.format(code=code)]
        reply = self.llm.invoke(input=message).dict()['content']
        StrOutputParser().parse(reply)
        return reply
    
    def generate_mermaid_chart(self,code,daiagram):
        system_message = "You are a software engineer and you have to write a mermaid script with correct mermaid syntax for {daigram} of the code: \n\n{code}"
        prompt = PromptTemplate(template= system_message, input_variables= ["code", "daigram"])
        sys = SystemMessagePromptTemplate(prompt=prompt)
        message = [sys.format(code=code, daigram=daiagram)]
        reply = self.llm.invoke(input=message).dict()['content']
        return reply
    


# # llm = LLM(OllamaLLM(model="llama3.1"))
# llm = LLM(ChatOpenAI())
# code = open("code.txt", "r").read()
# psudo_code = llm.generate_psudo_code(code)
# print(psudo_code)
# print(llm.generate_mermaid_chart(code,"flowchart"))





app = flask.Flask(__name__)
CORS(app)
@app.route('/')
def index():
    json = {
        'code': "graph TD:A[Start] --> B{Is it working?}; B -- Yes --> C[Hello World!]; B -- No --> D[Check the script]; D --> B;" }
    return json

# generate psudo code
@app.route('/generate_psudo_code', methods=['POST'])
def generate_psudo_code():
    data = flask.request.json
    code = data['code']
    llm = LLM()
    response = llm.generate_psudo_code(code)
    json ={
        'code': response
    }
    return json

# generate_mermaid_chart
@app.route('/generate_mermaid_chart', methods=['POST'])
def generate_mermaid_chart():
    data = flask.request.json
    code = data['code']
    daiagram = data['daiagram']
    llm = LLM()
    response = llm.generate_mermaid_chart(code,daiagram)
    json ={
        'code': response
    }
    return json

@app.route('/generate', methods=['POST'])
def generate():
    data = flask.request.json
    code = data['code']
    diagram = data['diagram']

    llm = LLM()
    psuedo = llm.generate_psudo_code(code)
    response = llm.generate_mermaid_chart(psuedo,diagram)
    json ={
        'code': response
    }
    return json

# run in development mode with reloader
if __name__ == '__main__':
    app.run(debug=True)









