const passw = new Bun.CryptoHasher("md5").update("samaKemarin00").digest("hex");
console.log(passw);
