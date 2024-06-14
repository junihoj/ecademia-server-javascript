import cors from 'cors';
const whitelist = [`${process.env.CLIENT_URL}`]
export const corsPolicy = cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    },
    methods: 'GET,PUT,PATCH,POST,DELETE',
   // `X-Csrf-Token` must be provided, otherwise the request would be blocked
    allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'X-Csrf-Token'],
    // credentials must be allowed, othewise cookies won't be sent to the client
    credentials: true,
});