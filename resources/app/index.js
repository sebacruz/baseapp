import 'app/index.scss';

__webpack_public_path__ = 'http://localhost:3000/assets/';

const dummyFn = () => {
  const dateObj = new Date();

  console.log({
    subject: 'This is the sample index.js script.',
    currentDate: dateObj
  });
}

dummyFn();
