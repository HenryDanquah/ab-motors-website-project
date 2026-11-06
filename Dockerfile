# ------------------------------------------------------------
# Containerized static website served by Nginx
# AB Motors - automotive marketplace (buy, rent, parts)
# ------------------------------------------------------------
FROM nginx:1.27-alpine

LABEL maintainer="DV Motors" \
      description="Static website containerized with Docker + Nginx"

# Default port. Free hosts override this:
#   Render -> sets PORT automatically (10000)
#   Hugging Face Spaces -> uses app_port: 8080 from README front-matter
ENV PORT=8080

# Remove the default Nginx site and config
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Create an unprivileged user (UID 1000) - never run web servers as root
RUN adduser -D -u 1000 app \
    && mkdir -p /tmp/nginx \
    && chown -R app:app /usr/share/nginx/html /var/cache/nginx /var/log/nginx /tmp/nginx

# Copy configuration, entrypoint and website files
COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY --chown=app:app site/ /usr/share/nginx/html/

RUN chmod +x /docker-entrypoint.sh

USER app

EXPOSE 8080

# Docker restarts/flags the container if the site stops responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
