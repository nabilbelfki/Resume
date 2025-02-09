server {
    listen 80;

    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    location /_next {
        alias /usr/share/nginx/html/.next;
    }

    location /static {
        alias /usr/share/nginx/html/public;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
