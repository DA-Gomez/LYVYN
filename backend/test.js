import express from 'express';
import { spawn } from 'child_process';

const app = express();
app.use(express.json());

const executePython = async (script, args) => {
  //each argument needs to be a string
  const input = args.map(arg => arg.toString());

  // this is the same as writing '$py model.py ....' in the cli
  const py = spawn("venv/Scripts/python", [script, ...input]);

  //promise that will return the results of the sript
  const result = await new Promise((resolve, reject) => {
    let output;

    //get output of the python
    py.stdout.on('data', (data) => {
      output = JSON.parse(data.toString());
    })

    //error handling
    py.stderr.on("data", (data) => {
      console.error('python error: ', data.toString());
      reject('error in ', script);
    })

    //run this once python scirpt is done
    py.on("exit", (code) => {
      resolve(output);
    })
  })

  return result;
}

app.get('/', async (req, res) => {
  try {
    const result = await executePython('ml/model.py', [1, 1, 1, 2, 1, 5]);
    res.json({result: result})
  } catch (e) {
    res.status(500).json({error: e})
  }
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});