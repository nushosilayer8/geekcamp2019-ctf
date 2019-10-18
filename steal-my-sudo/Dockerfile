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

# See https://github.com/containers/libpod/issues/3651#issuecomment-516232561
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
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
RUN mkdir -p /home/stealmysudo/.ssh
COPY key.pub /home/stealmysudo/.ssh/authorized_keys

USER root
# Setup attacker
RUN useradd -mUs /bin/bash attacker
RUN echo 'attacker:attacker' | chpasswd

# Make vulnerable. Two choices here
#RUN chmod a+w /usr/local/bin
RUN chmod a+w /home/stealmysudo/bin

# Start SSH
RUN mkdir /var/run/sshd
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
