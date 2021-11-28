import * as path from 'path';
import * as fs from 'fs';
import translate from 'baidu-translate-api';

const translateText = async (key: string, value: string, inputLanguage: string = 'en', outputLanguage: string = 'pt') => {
  try {
    const data = await translate(value, { from: inputLanguage, to: outputLanguage });
    const dataExists = fs.existsSync(path.resolve(process.cwd(), 'dist', `${outputLanguage}.json`))
    if (!dataExists) {
      fs.writeFileSync(path.resolve(process.cwd(), 'dist', `${outputLanguage}.json`), JSON.stringify({ }, null, 2));
    }

    const state = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'dist', `${outputLanguage}.json`), { encoding: 'utf-8' }));
    fs.writeFileSync(path.resolve(process.cwd(), 'dist', `${outputLanguage}.json`), JSON.stringify({ ...state, [key]: data.trans_result.dst }, null, 2));
  } catch (error) {
    console.log(error);
  }
}

const items = fs.readdirSync(path.resolve(process.cwd(), 'src'));
for (let item of items) {
  const files = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'src', item), { encoding: 'utf-8' })
  );

  for (let index in files) {
    translateText(index, files[index])
  }
}