FROM eadom/ctf_xinetd:latest
ARG BINARY=webserver2
ARG BINARY_DIR=.

ENV BINARY $BINARY
ENV BINARY_DIR $BINARY_DIR

RUN rm flag helloworld
COPY $BINARY_DIR/flag /home/ctf/flag
COPY $BINARY_DIR/$BINARY /home/ctf/$BINARY
RUN chmod 644 /home/ctf/flag && chmod 755 /home/ctf/$BINARY
RUN sed -i s/helloworld/$BINARY/ /etc/xinetd.d/ctf
