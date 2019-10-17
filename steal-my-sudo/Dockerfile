FROM ubuntu:cosmic

RUN apt-get update \
	&& apt-get install -y \
		wget \
		openssh-server \
		sudo \
		htop \
		vim \
		nano \
		emacs

# Setup flag
COPY flag.txt /flag.txt
RUN chmod 000 /flag.txt

# Setup vulnerable
RUN useradd -mUs /bin/bash -G sudo stealmysudo
RUN echo 'stealmysudo:GgSytT8p0nWcaWblAy8ejHfQxcy6yOSY' | chpasswd
USER stealmysudo 
WORKDIR /home/stealmysudo
RUN mkdir /home/stealmysudo/bin
RUN wget https://github.com/bootandy/dust/releases/download/v0.3.1/dust-v0.3.1-x86_64-unknown-linux-gnu.tar.gz \
	&& tar -xvf dust-v0.3.1-x86_64-unknown-linux-gnu.tar.gz -C /home/stealmysudo/bin \
	&& rm dust-v0.3.1-x86_64-unknown-linux-gnu.tar.gz
RUN wget https://caddyserver.com/download/linux/amd64?license=personal -O caddy.tar.gz \
	&& tar -xvf caddy.tar.gz -C /home/stealmysudo/bin caddy \
	&& rm caddy.tar.gz

USER root
# Setup attacker
RUN useradd -mUs /bin/bash attacker
RUN echo 'attacker:attacker' | chpasswd

# Make vulnerable
RUN chmod a+w /home/stealmysudo/bin

# Start SSH
RUN mkdir /var/run/sshd
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
