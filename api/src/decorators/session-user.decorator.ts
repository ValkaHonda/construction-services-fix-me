import { createParamDecorator } from '@nestjs/common';

export const SessionUser = createParamDecorator ((data, req) => {
    return data ? req.user[data] : req.user;
});
