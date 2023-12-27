FROM php:8-fpm-alpine

ENV PHP_MEMORY_LIMIT=512M

RUN echo "---> Enabling PHP-Alpine" && \
    apk add --update \
    wget \
    curl \
    openssh \
    bash \
    fontconfig \
    libxrender \
    libxext \
    imagemagick \
    nano \
    vim \
    git \
    unzip \
    wget \
    make \
    sudo

RUN  apk add --update \
    $PHPIZE_DEPS \
    openssl-dev \
    libzip-dev \
    libxslt-dev \
    gettext-dev \
    libpng-dev \
    zlib-dev \
    icu-dev \
    oniguruma-dev \
    postgresql-dev \
    imap-dev \
    php-zlib \
    postgresql-client

RUN apk add --no-cache libzip-dev \
    && docker-php-ext-install zip

RUN docker-php-ext-install pdo_mysql && \
    docker-php-ext-install zip && \
    docker-php-ext-install xsl && \
    docker-php-ext-install exif  && \
    docker-php-ext-install pcntl && \
    docker-php-ext-install opcache && \
    docker-php-ext-install xml && \
    docker-php-ext-install gettext && \
    docker-php-ext-install gd && \
    docker-php-ext-install intl && \
    docker-php-ext-install mbstring && \
    docker-php-ext-install pdo_pgsql && \
    docker-php-ext-install imap

RUN pecl install redis && \
    docker-php-ext-enable redis

RUN apk add unixodbc-dev

RUN curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.7.2.1-1_amd64.apk
RUN curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/mssql-tools_17.7.1.1-1_amd64.apk

RUN sudo apk add --allow-untrusted msodbcsql17_17.7.2.1-1_amd64.apk
RUN sudo apk add --allow-untrusted mssql-tools_17.7.1.1-1_amd64.apk

RUN pecl install \
    sqlsrv \
    pdo_sqlsrv \
    && docker-php-ext-enable sqlsrv \
    && docker-php-ext-enable pdo_sqlsrv

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer; \
    chmod +x /usr/local/bin/composer;

RUN echo "---> Adding the tecnobit user" && \
    adduser -D -u 1000 tecnobit && \
    mkdir -p /var/www/app && \
    chown -R tecnobit:tecnobit /var/www && \
    cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini && \
    echo "---> Configuring PHP" && \
    echo "tecnobit  ALL = ( ALL ) NOPASSWD: ALL" >> /etc/sudoers && \
    sed -i "/memory_limit = .*/c\memory_limit = $PHP_MEMORY_LIMIT" /usr/local/etc/php/php.ini && \
    sed -i "/user = .*/c\user = tecnobit" /usr/local/etc/php-fpm.d/www.conf && \
    sed -i "/^group = .*/c\group = tecnobit" /usr/local/etc/php-fpm.d/www.conf && \
    sed -i "/listen.owner = .*/c\listen.owner = tecnobit" /usr/local/etc/php-fpm.d/www.conf && \
    sed -i "/listen.group = .*/c\listen.group = tecnobit" /usr/local/etc/php-fpm.d/www.conf && \
    sed -i "/listen = .*/c\listen = [::]:9000" /usr/local/etc/php-fpm.d/www.conf && \
    sed -i "/;access.log = .*/c\access.log = /proc/self/fd/2" /usr/local/etc/php-fpm.d/www.conf && \
    sed -i "/;clear_env = .*/c\clear_env = no" /usr/local/etc/php-fpm.d/www.conf && \
    sed -i "/;catch_workers_output = .*/c\catch_workers_output = yes" /usr/local/etc/php-fpm.d/www.conf && \
    sed -i "/pid = .*/c\;pid = /run/php/php8.0-fpm.pid" /usr/local/etc/php-fpm.conf && \
    sed -i "/;daemonize = .*/c\daemonize = yes" /usr/local/etc/php-fpm.conf && \
    sed -i "/error_log = .*/c\error_log = /proc/self/fd/2" /usr/local/etc/php-fpm.conf && \
    sed -i "/;rlimit_files = .*/c\rlimit_files = 8192" /usr/local/etc/php-fpm.conf && \
    sed -i "/;rlimit_core = .*/c\rlimit_core = unlimited" /usr/local/etc/php-fpm.conf && \
    sed -i "/post_max_size = .*/c\post_max_size = 1000M" /usr/local/etc/php/php.ini && \
    sed -i "/upload_max_filesize = .*/c\upload_max_filesize = 1000M" /usr/local/etc/php/php.ini && \
    chown -R tecnobit:tecnobit /home/tecnobit && \
    rm -rf /tmp/*

USER tecnobit

WORKDIR /var/www/app

EXPOSE 9000

CMD ["php-fpm"]
