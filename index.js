import Config from "./config.js";

import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("browser"));

const applications = [];

app.post("/api/checkNumber", (req, res) => {
    const { value: { origin } } = req.body;

    res.send(JSON.stringify({
        status: origin.search(/^[1-3]0[1-8][0-4][0-9]$/) === -1? "FAIL": "SUCCESS",
        message: "학번의 형식이 잘못되었습니다."
    }));
});

app.post("/api/checkPhone", (req, res) => {
    const { value: { origin } } = req.body;

    res.send(JSON.stringify({
        status: origin.search(/^(?:010)?-?([0-9]{4})-?([0-9]{4})$/) === -1? "FAIL": "SUCCESS",
        message: "전화번호 형식이 잘못되었습니다."
    }));
});

app.post("/api/umbrella", (req, res) => {
    const { action: { params: { number, name, phone } } } = req.body;

    for(let i = 0; i < applications.length; i++) {
        if(applications[i].number === number) {
            res.send(JSON.stringify({
                version: "2.0",
                data: { msg: "이미 우산 대여 신청이 완료된 학번입니다." }
            }));
            return;
        }
    }

    applications.push({
        name, number, phone,
        status: "waiting",
        umbrellaNumber: null
    });
    res.send(JSON.stringify({
        version: "2.0",
        data: { msg: "우산 대여 신청이 완료되었습니다.\n방과후에 학생회의 연락을 기다려주세요." }
    }));
});

app.get("/api/umbrella", (req, res) => {
    res.send(JSON.stringify(applications));
});

app.delete("/api/umbrella", (req, res) => {
    const { number } = req.body;

    for(let i = 0; i < applications.length; i++) {
        if(applications[i].number === number) {
            applications.splice(i, 1);
            res.send(JSON.stringify({
                status: "SUCCESS",
                detail: "Successfully removed"
            }));
            return;
        }
    }
    res.send(JSON.stringify({
        status: "FAILURE",
        detail: "No such application"
    }));
});

app.put("/api/umbrella", (req, res) => {
    const { number, umbrellaNumber } = req.body;

    for(let i = 0; i < applications.length; i++) {
        if(applications[i].number === number) {
            applications[i].status = "rental";
            applications[i].umbrellaNumber = umbrellaNumber;
            res.send(JSON.stringify({
                status: "SUCCESS",
                detail: "Successfully updated"
            }));
            return;
        }
    }
    res.send(JSON.stringify({
        status: "FAILURE",
        detail: "No such application"
    }));
})

app.listen(Config.port, () => {
    console.log(`The server is running on port ${Config.port}`);
});