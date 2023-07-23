import isUrlHttp from 'is-url-http'

console.log(isUrlHttp('https://kikobeats.com')) // ==> true
console.log(isUrlHttp('httpkikobeats.com')) // ==> true
console.log(isUrlHttp('https://www.kikobeats.com')) // ==> true
console.log(isUrlHttp('www.kikobeats.com')) // ==> true
console.log(isUrlHttp('mailto://kiko@beats.com')) // ==> false
console.log(isUrlHttp('callto:192.168.103.77+type=ip')) // ==> false
