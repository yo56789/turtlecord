os.loadAPI("json")
local ws, err = http.websocket("ws://e931-108-49-248-149.ngrok.io") -- replace url.ngrok.io with your ngrok url

if err then
    print(err)
end
else if ws then 
    print("> Connected")
    while true do
        local message = ws.receive()
        print(message)
        local obj = json.decode(message)
        if obj.type == "exit" then 
            ws.close()
            break
        end
        if obj.type == "eval" then
            local funcrunned = load(obj.code)
            print(funcrunned())
        end
    end
end 