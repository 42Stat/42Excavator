docker run -it --rm --name node_env -d -v${PWD}:/tmp node:19.2.0-alpine3.16
docker exec -it noder sh