import cluster from 'cluster';
import { cpus } from 'os';
import http from 'http';
import { fork } from 'child_process';

const numCPUs = cpus().length;
const PORT = 4000;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    const ports = Array.from({ length: numCPUs - 1 }, (_, i) => PORT + i + 1);

    let currentIndex = 0;
    const loadBalancer = http.createServer((req, res) => {
        const proxyPort = ports[currentIndex];
        const proxyReq = http.request(
            {
                host: 'localhost',
                port: proxyPort,
                path: req.url,
                method: req.method,
                headers: req.headers,
            },
            (proxyRes) => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res, { end: true });
            }
        );

        req.pipe(proxyReq, { end: true });

        currentIndex = (currentIndex + 1) % ports.length;
    });

    loadBalancer.listen(PORT, () => {
        console.log(`Load balancer is running on http://localhost:${PORT}`);
    });

    ports.forEach((port) => {
        const worker = fork('./src/simple-crud-api.ts', [], {
            env: { PORT: port, ...process.env },
        });

        console.log(`Worker started on http://localhost:${port} (pid: ${worker.pid})`);
    });
} else {
    console.log(`Worker ${process.pid} started`);
}
