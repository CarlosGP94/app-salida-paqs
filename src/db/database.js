import odbc from "odbc";
import { DB_CONFIG } from "../utils/constants";

class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    this.remote = null;
    this.active = null;
    this.status = { target: "unknown", connected: false };

    Database.instance = this;
  }

  _setActive(connection, target) {
    this.active = connection;
    this.status = {
      target, // "remote"
      connected: true,
    };
    console.log("⚡ DB ACTIVE =", this.status);
  }

  // -------------------------------
  // CONECTAR A SQL SERVER REMOTO
  // -------------------------------
  // Uid=${DB_CONFIG.remote.user};
  //  Pwd=${DB_CONFIG.remote.password}; s
  async connectRemote() {
    try {
      console.log("Intentando conectar a SQL Server remoto...");

      this.remote = await odbc.connect(
        `Driver={ODBC Driver 17 for SQL Server};
         Server=${DB_CONFIG.remote.server};
         Database=${DB_CONFIG.remote.database};
         Uid=${DB_CONFIG.remote.user};
         Pwd=${DB_CONFIG.remote.password};
         TrustServerCertificate=Yes;
         LoginTimeout=2;`,
      );

      console.log("✔ Conectado a SQL Server remoto");
      this._setActive(this.remote, "remote");
      return this.remote;
    } catch (err) {
      console.error("❌ No se pudo conectar al remoto:", err);
      this.remote = null;
      throw new Error("No se pudo conectar al SQL Server remoto.");
    }
  }

  async connect() {
    console.log("Inicializando conexión a BD remota...");
    return await this.connectRemote();
  }

  getConnection() {
    if (!this.active) throw new Error("Base de datos no conectada.");
    return this.active;
  }
}

const database = new Database();
export default database;
