const { log } = require('console');
const fs = require('fs');

const BACKUPER_WAIT = 1;
const BACKUPER_WORK = 2;

const BACKUP_TIME_DIFF = 1000*60;

const DATABASES = ["database", "users"];

const BACKUP_PATH = "./backup/";
const DB_PATH = "./db/";

class Backuper {
  constructor() {
    this.buffer = new SharedArrayBuffer(16);
    this.uint8 = new Uint8Array(this.buffer);
    Atomics.store(this.uint8, 0, BACKUPER_WAIT);
    this.date = new Date();
  }

  StartBackup() {
    const res = Atomics.exchange(this.uint8, 0, BACKUPER_WORK);
    if (res == BACKUPER_WORK)
      return res;
    const now_date = new Date();
    if (now_date - this.date > BACKUP_TIME_DIFF) {
      this.date = now_date;
      return res;
    }
    Atomics.exchange(this.uint8, 0, BACKUPER_WAIT);
    return BACKUPER_WORK;
  }

  CreateFolder(path) {
    return new Promise(function(resolve, reject) {
      fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          fs.mkdir(path, { recursive: true }, (err) => {
            if (err) {
              log(err);
              resolve(false);
            } else {
              resolve(true);
            }
          });
        } else {
          resolve(false);
        }
      });
    });
  }

  CopyFile(from, to) {
    fs.copyFile(from, to, (err) => {
        if (err) console.log(err);
        else {
          console.log(`Databse ${from} copied`);
        }
    });
  }

  async Backup() {
    if (this.StartBackup() == BACKUPER_WORK) {
        return;
    }
    this.CreateFolder(BACKUP_PATH).then(res => {
      this.CreateFolder(BACKUP_PATH + this.date.toISOString()).then(res => {
        fs.readdir(DB_PATH, (err, files) => {
          if (err) {
            console.error('Ошибка при чтении директории:', err);
            return;
          }
          files.forEach(file => {
            this.CopyFile(DB_PATH + file, BACKUP_PATH + this.date.toISOString() + '/' + file);
          });
          Atomics.store(this.uint8, 0, BACKUPER_WAIT);
        });
      });
    });
  }
}

module.exports = Backuper;