import app from './app';
import { cliLogger} from './utils/Logger';
require('dotenv').config();

const PORT = 8080;
app.listen(PORT);
cliLogger.info(`Running in port ${PORT}`);