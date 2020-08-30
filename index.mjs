'use strict';

import app from './app/index.mjs';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Express is running on port ${PORT}`);
});