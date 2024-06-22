import { WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({
    namespace: 'chat',
})

