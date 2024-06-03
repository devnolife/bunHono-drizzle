import { db, client } from "./db"; // Adjust the path to your db module

(async () => {
  try {
    await client.connect();
    const biayasiswa = await db.query.beasiswa.findMany({
      with: {
        jenisBeasiswa: true,
        nilaiRaport: true,
        mahasiswa: true,
      },
    });
    console.log("Biayasiswa:", biayasiswa);
    await client.end();
  } catch (error) {
    console.error("Error fetching user with relations:", error);
  }
})();
