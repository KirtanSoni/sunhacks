from langchain_openai import ChatOpenAI
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.prompts.chat import SystemMessagePromptTemplate
from langchain_core.output_parsers import StrOutputParser
import flask
from flask_cors import CORS
from dotenv import load_dotenv
import re
import os

GENERATE_PSUDO_CODE="""
You are a software engineer and you have to write psuedocode for a given code 
1.	Understand the Code: Review the code logic thoroughly to identify key processes, decisions, and loops.
2.	Identify Components:Break the code down into key sections like:
    a. Start/End points.
    b. Process steps (actions or tasks).
    c. Decision points (conditional branches).
    d. Loops (repeating processes).
    e. Inputs/Outputs (data flowing in and out).
    f. for the following code :
    Make sure there are no special characters in the code.
    {code}
    """
GENERATE_MERMAID_CHART="""
You are a software engineer and you have to write a mermaid script with correct mermaid syntax. Keep in mind to
Define Symbols:
Standard symbols:
	a. Oval: Start/End.
	b. Rectangle: Process/Action.
	c. Diamond: Decision/Condition.
	d. Arrow: Flow direction.
	e. Parallelogram: Input/Output.
Generate/Draw the Diagram: output mermaid code to draw a {daigram} of the code: \n\n{code}
"""



load_dotenv()
# openai.api_key = os.getenv('OPENAI_KEY')

class LLM:
    def __init__(self,llm = ChatOpenAI()):
        self.llm =  llm#ChatOpenAI(temperature = tempereature)
        

    # remove special characters from the code
    def sanitize_code(self,code):
        code = re.sub(r'[^\w\s]','',code)
        return code


    def generate_psudo_code(self,code):
        prompt = PromptTemplate(template= GENERATE_PSUDO_CODE, input_variables= ["code"])
        sys = SystemMessagePromptTemplate(prompt=prompt)
        message = [sys.format(code=code)]
        reply = self.llm.invoke(input=message).dict()['content']
        reply = self.extract_code(reply)
        return reply
    
    def extract_code(self,gpt_response):
        pattern = r'```mermaid[\s\S]*?```'
        mermaid_code = re.findall(pattern,gpt_response)[0]
        return mermaid_code[10:-4]
    
    def generate_mermaid_chart(self,code,daiagram):
        prompt = PromptTemplate(template= GENERATE_MERMAID_CHART, input_variables= ["code", "daigram"])
        sys = SystemMessagePromptTemplate(prompt=prompt)
        message = [sys.format(code=code, daigram=daiagram)]
        reply = self.llm.invoke(input=message).dict()['content']
        code = self.extract_code(reply)
        return code
    


app = flask.Flask(__name__)
CORS(app)


@app.route('/')
def index():
    json = {
        'code': """flowchart TD
    Start --> HelloWorld[Hello World]
    HelloWorld --> Finish""" 
    }
    return json

# generate_mermaid_chart
@app.route('/generated_direct', methods=['POST'])
def generate_mermaid_chart():
    data = flask.request.json
    code = data['code']
    daiagram = data['daiagram']
    llm = LLM()
    response = llm.generate_mermaid_chart(code,daiagram)
    json = {
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
    json = {
        'code': response
    }
    return json

# run in development mode with reloader
if __name__ == '__main__':
    app.run(debug=True)









