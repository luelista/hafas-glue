
import {createClient} from 'hafas-client';
import {profile as dbProfile} from 'hafas-client/p/db/index.js'
import {profile as rmvProfile} from 'hafas-client/p/rmv/index.js'
import {profile as vrnProfile} from 'hafas-client/p/vrn/index.js'
import {profile as bvgProfile} from 'hafas-client/p/bvg/index.js'
import {profile as oebbProfile} from 'hafas-client/p/oebb/index.js'
import {data as loyaltyCards} from 'hafas-client/p/db/loyalty-cards.js'
import { NodeCrypto, WebSocketRpcClient } from 'pinboard';

import 'dotenv/config';
const RPC = process.env.RPC || 'ws://localhost:3000';
const TOKEN = process.env.TOKEN || '';
const DB_FILE = process.env.DB_FILE || '';

const rpc = new WebSocketRpcClient(RPC, await NodeCrypto.create());
rpc.errorOccured.connect((errMes) => {
    console.error("ERR:",errMes);
});
rpc.connected.connect(async () => {
    console.info("WS connected");
    if (TOKEN){
        var result = await rpc.rpcMethodCall('pb', 'broker', 'broker', 'register_name', [TOKEN], {}, 0);
        console.log("login result", result);
    }
});
rpc.websocketConnect();

// Adapt this to your project! createClient() won't work with this string.
const userAgent = 'pinboard'


class HafasAdapterRpc {
    constructor(profile, userAgent) {
        this.client = createClient(profile, userAgent);
        this.profile = profile;
    }
    trip(ctx){
	    return this.client.trip.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    refreshJourney(ctx){
	    return this.client.refreshJourney.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    reachableFrom(ctx){
	    return this.client.reachableFrom.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    arrivals(ctx){
	    return this.client.arrivals.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    nearby(ctx){
	    return this.client.nearby.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    departures(ctx){
	    return this.client.departures.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    locations(ctx){
	    return this.client.locations.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    stop(ctx){
	    return this.client.stop.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    radar(ctx){
	    return this.client.radar.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    journeysFromTrip(ctx){
	    return this.client.journeysFromTrip.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    tripsByName(ctx){
	    return this.client.tripsByName.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    remarks(ctx){
	    return this.client.remarks.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    lines(ctx){
	    return this.client.lines.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    serverInfo(ctx){
	    return this.client.serverInfo.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    journeys(ctx, from, to, options){
        if (options?.loyaltyCard?.type) options.loyaltyCard.type = loyaltyCards[options.loyaltyCard.type];
        return this.client.journeys.apply(this.client, Array.prototype.slice.call(arguments, 1));
    }
    profile(ctx) {
        return profile;
    }
}
rpc.registerObject('db-hafas', ['hafas'], new HafasAdapterRpc(dbProfile, userAgent));
rpc.registerObject('rmv-hafas', ['hafas'], new HafasAdapterRpc(rmvProfile, userAgent));
rpc.registerObject('vrn-hafas', ['hafas'], new HafasAdapterRpc(vrnProfile, userAgent));
rpc.registerObject('bvg-hafas', ['hafas'], new HafasAdapterRpc(bvgProfile, userAgent));
rpc.registerObject('oebb-hafas', ['hafas'], new HafasAdapterRpc(oebbProfile, userAgent));


