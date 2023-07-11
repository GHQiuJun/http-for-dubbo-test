const express = require('express')
const process = require('process')
const {Telnet} = require("telnet-client");
const servicePort = require("./config");
const app = express()
app.use(express.json())

app.post('/dubbo-test', async (req, resp) => {
    try {
        let form = req.body
        new TelnetTool(form).invokeDubbo()
            .then(r => {
                resp.send(r)
            })
            .catch(r => {
                resp.send(r)
            })
    } catch (err) {
        resp.send(err.stack)
    }
})

class TelnetTool {

    constructor(body) {
        if (!body.host) {
            throw new Error("host can't be empty")
        }
        if (!body.port) {
            throw new Error("port can't be empty")
        }
        if (!body.service && !body.provider) {
            throw new Error("service or provider can't be empty")
        }
        if (!body.method) {
            throw new Error("method can't be empty")
        }
        this.host = body.host
        this.port = body.port
        this.service = body.service || body.provider
        this.method = body.method
        this.param = body.param
    }

    getTelnetConfig() {
        return {
            host: this.host,
            port: this.port,
            negotiationMandatory: false,
            timeout: 3000,
            encoding: 'utf-8'
        }
    }

    getServicePath() {
        const _this = this
        const telnet = new Telnet()
        const config = this.getTelnetConfig()
        const command = `ls ${this.service}`
        return new Promise((resolve, reject) => {
            telnet.connect(config)
                .then(_ => {
                    telnet
                        .send(command)
                        .then(r => {
                            const providerKey = ' (as provider)'
                            if (!r) {
                                reject(`Run dubbo command fail, command: ${command}`)
                            }
                            if (r.indexOf(providerKey) < 0) {
                                reject(`Service not found, service: ${_this.service}, info: ${r}`)
                            }
                            let servicePath = r.split(providerKey)[0];
                            telnet.end().then(r => console.log("获取服务地址完成：" + servicePath))
                            resolve(servicePath)
                        })
                })
        })
    }

    getDubboInvokeParam() {
        const param = this.param
        if (!param) {
            return ''
        }
        switch (typeof param) {
            case 'string': {
                return param.split(',').map(v => '\"' + v + '\"').join(',')
            }
            case 'object': {
                return JSON.stringify(param)
            }
        }
    }

    invokeDubbo() {
        const telnet = new Telnet()
        const connectConfig = this.getTelnetConfig()
        const param = this.getDubboInvokeParam()

        return new Promise((resolve, reject) => {
            this.getServicePath()
                .then(provider => {
                    let command = `invoke ${provider}.${this.method}(${param})`
                    console.log("invoke command :" + command)
                    telnet.connect(connectConfig)
                        .then(_ => {
                            console.log("invoke command after connect success")
                            telnet.send(command)
                                .then(r => {
                                    console.log("invoke success result:" + r)
                                    resolve(r)
                                })
                        })
                })
                .catch(r => {
                    console.log("invoke fail result:" + r)
                    reject(r)
                })
        })
    }
}

process.on('uncaughtException', (error, source) => {
    console.log('uncaughtException Source: ', source)
    console.log(error)
});

app.listen(servicePort)
console.log("app run success port: " + servicePort)