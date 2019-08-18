class Job {
    constructor(name, work, callback) {
        this.work = work;
        this.progress = 0;
        this.name = name;
        this.callback = callback;
    }

    static create(name, work, callback) {
        let obj = new Job(name, work, callback);
        return obj;
    }

    doWork(amount) {
        this.progress += amount;
        if (this.progress >= this.work) {
            this.complete();
        }
    }

    complete() {
        this.callback();
    }
}