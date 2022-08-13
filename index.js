const fs = require('fs');
const superagent = require('superagent');

// Solution 1
// fs.readFile(`${__dirname}/dog.txt`, 'utf8', (err, data) => {
//   if (err) return console.log(err.message);
//   console.log(`Breed: ${data}`);

//   superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, res) => {
//     if (err) return console.log(err.message);
//     console.log(res._body.message);

//     fs.writeFile('output.txt', res._body.message, (err) => {
//       if (err) return console.log(err.message);
//       console.log('Image saved successfully');
//     });
//   });
// });

// Solution 2: Promises - then
// fs.readFile(`${__dirname}/dog.txt`, 'utf8', (err, data) => {
//   if (err) return console.log(err.message);
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res._body.message);

//       fs.writeFile('output.txt', res._body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log('Image saved successfully');
//       });
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// Solution 3: Promises
// Create my own promise and aliminate a callback hell at all
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject("I'd not find that file");
      //   Data will be available in then method
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("I couldn'd write the file");
      resolve('Whitten successfully');
    });
  });
};
// Consume the promise above
/*
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res._body.message);
    return writeFilePro('output.txt', res._body.message);
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err.message);
  });
*/
/*
  This 3rd solution is almost perfect as it is skip out call back hell
  */

// Async await : Promises | No need thencatch statemesnts

// const getDogPic = async () => {
//   try {
//     const data = await readFilePro(`${__dirname}/dog.txt`);
//     console.log(`Breed: ${data}`);

//     const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//     console.log(res._body.message);

//     const wFile = await writeFilePro('output.txt', res._body.message);
//     console.log(wFile);
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
//   return 'READY!';
// };
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res2 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res3 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

    const all = await Promise.all([res1, res2, res3]);
    const imgs = all.map((el) => el._body.message);
    console.log(imgs);

    const wFile = await writeFilePro('output.txt', imgs.join('\n'));
    console.log(wFile);
  } catch (error) {
    console.log(error);
    throw error;
  }
  return 'READY!';
};

// Grasp the order of .exe

/**
 * if
 */
// console.log('1: I will get dog pics');
// Not pratical though
// const ready = getDogPic();
// console.log(ready);
// console.log('2: Done getting dog pics');

// Option 1
// getDogPic()
//   .then((res) => {
//     console.log(res);
//     console.log('3: Done getting dog pics');
//   })
//   .catch((err) => {
//     console.log('ERROR');
//   });

// Option 2 : Immediately Invoked Function Expression

(async () => {
  try {
    console.log('1: I will get dog pics');
    const res = await getDogPic();
    console.log(res);
    console.log('3: Done getting dog pics');
  } catch (error) {
    console.log('ERROR');
  }
})();

// Dealing with multiple promises
