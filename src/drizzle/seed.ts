import { db, client } from "db";
import { users, beasiswa, jenisBeasiswa, mhs, nilaiRaport } from "schema";

(async () => {
  try {
    client.connect();
    const biayasiswa = await db.query.beasiswa.findMany({
      with: {
        jenisBeasiswa: true,
        nilaiRaport: true,
        mahasiswa: true,
      },
    });
    console.log("Biayasiswa:", biayasiswa);
    client.end();
  } catch (error: any) {
    console.error(error.message);
  }
})();
