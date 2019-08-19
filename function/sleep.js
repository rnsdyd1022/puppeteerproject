 const sleep = async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };

  module.exports= sleep;