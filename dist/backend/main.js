"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const config_service_1 = require("./config/config.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_service_1.AppConfigService);
    const logger = new common_1.Logger('Bootstrap');
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'https://cineclub-ai.vercel.app'
        ],
        credentials: true
    });
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const port = process.env.PORT || config.get('NEST_PORT') || 3000;
    await app.listen(port);
    logger.log(`Backend Nest escuchando en puerto ${port}`);
}
bootstrap();
