package cl.duoc.cladelgado.levelup_api_gateway.config;

import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class DisableCorsFilter implements WebFilter, Ordered {

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE; // Máxima prioridad posible
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String origin = exchange.getRequest().getHeaders().getOrigin();
        if (origin == null) origin = "*";
        
        // Manejar preflight OPTIONS inmediatamente
        if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
            HttpHeaders headers = exchange.getResponse().getHeaders();
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, origin);
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, PUT, DELETE, OPTIONS, PATCH");
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "*");
            if (!origin.equals("*")) {
                headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
            }
            headers.add(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "3600");
            exchange.getResponse().setStatusCode(HttpStatus.OK);
            return Mono.empty();
        }
        
        // Para otras peticiones, usar decorator para agregar headers
        final String finalOrigin = origin;
        return chain.filter(exchange.mutate().response(
            new org.springframework.http.server.reactive.ServerHttpResponseDecorator(exchange.getResponse()) {
                @Override
                public Mono<Void> writeWith(org.reactivestreams.Publisher<? extends org.springframework.core.io.buffer.DataBuffer> body) {
                    getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, finalOrigin);
                    if (!finalOrigin.equals("*")) {
                        getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
                    }
                    return super.writeWith(body);
                }
            }
        ).build());
    }
}
