import { MESSAGE_REPOSITORY } from "src/core/constants";
import { Message } from "./message.entity";

export const messagesProviders = [{
    provide: MESSAGE_REPOSITORY,
    useValue: Message,
}]