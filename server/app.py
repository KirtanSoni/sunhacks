from langchain_openai import ChatOpenAI
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.prompts.chat import SystemMessagePromptTemplate
import flask
from flask_cors import CORS
from dotenv import load_dotenv
import re

GENERATE_PSUDO_CODE="""
You are a software engineer and you have to write psuedocode for a given code to caputre the logic of the code. Write a psuedocode for the code: \n\n
    {code}
    """
GENERATE_MERMAID_CHART="""
You are a software engineer and you have to write a mermaid script with correct mermaid syntax. Keep in mind NOT to use '(' ')' or '{{' '}}' write name notations in the diagram. use subgraphs where necessary.
Generate/Draw the Diagram: output mermaid code to draw a {diagram} of the code: \n\n{code}
"""



load_dotenv()
# openai.api_key = os.getenv('OPENAI_KEY')

class LLM:
    def __init__(self,llm = ChatOpenAI()):
        self.llm =  llm#ChatOpenAI(temperature = tempereature)
        
    def log(self,message):
        open("logs/log.txt","a").write("\n" + message + "\n")

    # remove special characters from the code
    def sanitize_code(self,code):
        code = re.sub(r'[^\w\s]','',code)
        return code


    def generate_psudo_code(self,code):
        prompt = PromptTemplate(template= GENERATE_PSUDO_CODE, input_variables= ["code"])
        sys = SystemMessagePromptTemplate(prompt=prompt)
        message = [sys.format(code=code)]
        reply = self.llm.invoke(input=message).dict()['content']
        reply = self.sanitize_code(reply)
        self.log(reply)
        return reply
    
    def extract_code(self,gpt_response):
        pattern = r'```mermaid[\s\S]*?```'
        mermaid_code = re.findall(pattern,gpt_response)[0]
        return mermaid_code[10:-4]
    
    def generate_mermaid_chart(self,code,diagram):
        prompt = PromptTemplate(template= GENERATE_MERMAID_CHART, input_variables= ["code", "diagram"])
        sys = SystemMessagePromptTemplate(prompt=prompt)
        message = [sys.format(code=code, diagram=diagram)]
        reply = self.llm.invoke(input=message).dict()['content']
        code = self.extract_code(reply)
        self.log(code)

        # fix the mermaid code
        # code = self.fix_mermaid_code(code)

        return code
    
    def fix_mermaid_code(self,code):
        prompt = PromptTemplate(template= "Fix the mermaid code write in box notations as plain alpha numeric words in all caps. \n\n output code  : \n\n{code}", input_variables= ["code"])
        sys = SystemMessagePromptTemplate(prompt=prompt)
        message = [sys.format(code=code)]
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
    diagram = data['diagram']
    llm = LLM()
    response = llm.generate_mermaid_chart(code,diagram)
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









