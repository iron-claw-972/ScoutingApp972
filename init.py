from SimpleHTTPServer import *

def run(server_class=HTTPServer, handler_class=BaseHTTPRequestHandler):
    server_address = ('169.254.48.173', 8000)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()