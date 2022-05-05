"use strict"

import StudierenderService from "../service/studierender.service.js";
import { wrapHandler } from "../utils.js";
import RestifyError from "restify-errors";

/**
 * HTTP-Controller-Klasse für die Studierenden
 * registriert alle notwendigen URL-Handler beim Webserver für einen einfachen REST-Webservice zum Lesen und Schreiben von Adressen
 */
export default class StudierenderController {
    /**
     * Konstruktor; registriert alle URL-Handler
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Prefix von allen URLs der Klasse
     */
    constructor(server, prefix) {
        this._service = new StudierenderService();
        this._prefix = prefix;

        // Collection: Studierende
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Entity: Studierender
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }

    /**
     * fügt alle HATEOAS-Links hinzu (für den entsprechenden Datensatz)
     * @param entity
     * @private
     */
    _insertHateoasLinks(entity) {
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read: {
                url: url,
                method: "GET"
            },
            update: {
                url: url,
                method: "PUT"
            },
            patch: {
                url: url,
                method: "PATCH"
            },
            delete: {
                url: url,
                method: "DELETE"
            },
        }
    }

    /**
     * GET /studierender
     * alle Studierende auslesen
     */
    async search(req, res, next) {
        let result = await this._service.search(req.query);
        result.forEach(entity => this._insertHateoasLinks(entity));
        res.sendResult(result);

        return next();
    }

    /**
     * POST /studierender
     * einen neuen Studierenden anlegen
     */
    async create(req, res, next) {
        let result = await this._service.create(req.body);
        this._insertHateoasLinks(result);

        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.sendResult(result);

        return next();
    }

    /**
     * GET /studierender/{id}
     * einen einzelnen Studierenden mittels der ID auslesen
     */
    async read(req, res, next) {
        let result = await this._service.read(req.params.id);
        this._insertHateoasLinks(result);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Studierender wurde nicht gefunden");
        }

        return next();
    }

    /**
     * PATCH und PUT /studierender/{id}
     * Daten eines einzelnen Studierenden ändern mittels der ID
     */
    async update(req, res, next) {
        let result = await this._service.update(req.params.id, req.body);
        this._insertHateoasLinks(result);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Studierender wurde nicht gefunden");
        }

        return next();
    }

    async delete(req, res, next) {
        await this._service.delete(req.params.id);
        res.status(204);
        res.sendResult({});
        return next();
    }
}