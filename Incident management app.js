{
    "definition": {
        "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
        "actions": {
            "Condition": {
                "actions": {
                    "Update_incident": {
                        "inputs": {
                            "body": {
                                "classification": {
                                    "ClassificationAndReason": "BenignPositive - SuspiciousButExpected",
                                    "ClassificationReasonText": "East Coast failover condition not met"
                                },
                                "incidentArmId": "@triggerBody()?['object']?['id']",
                                "severity": "Informational",
                                "status": "Closed",
                                "tagsToAdd": {
                                    "TagsToAdd": [
                                        {
                                            "Tag": "EastUS-Online"
                                        }
                                    ]
                                }
                            },
                            "host": {
                                "connection": {
                                    "name": "@parameters('$connections')['azuresentinel_1']['connectionId']"
                                }
                            },
                            "method": "put",
                            "path": "/Incidents"
                        },
                        "runAfter": {},
                        "type": "ApiConnection"
                    }
                },
                "expression": {
                    "and": [
                        {
                            "not": {
                                "equals": [
                                    "@body('Parse_JSON')?['properties']?['availabilityState']",
                                    "Unavailable"
                                ]
                            }
                        }
                    ]
                },
                "runAfter": {
                    "Parse_JSON": [
                        "Succeeded"
                    ]
                },
                "type": "If"
            },
            "HTTP": {
                "inputs": {
                    "authentication": {
                        "type": "ManagedServiceIdentity"
                    },
                    "method": "GET",
                    "uri": "https://management.azure.com/subscriptions/1c61ccbf-70b3-45a3-a1fb-848ce46d70a6/resourcegroups/CxE-inwafula/providers/microsoft.operationalinsights/workspaces/IWSec/providers/Microsoft.ResourceHealth/availabilityStatuses/current?api-version=2018-07-01"
                },
                "runAfter": {},
                "type": "Http"
            },
            "Parse_JSON": {
                "inputs": {
                    "content": "@body('HTTP')",
                    "schema": {
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "location": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            },
                            "properties": {
                                "properties": {
                                    "availabilityState": {
                                        "type": "string"
                                    },
                                    "occuredTime": {
                                        "type": "string"
                                    },
                                    "reasonChronicity": {
                                        "type": "string"
                                    },
                                    "reasonType": {
                                        "type": "string"
                                    },
                                    "reportedTime": {
                                        "type": "string"
                                    },
                                    "summary": {
                                        "type": "string"
                                    },
                                    "title": {
                                        "type": "string"
                                    }
                                },
                                "type": "object"
                            },
                            "type": {
                                "type": "string"
                            }
                        },
                        "type": "object"
                    }
                },
                "runAfter": {
                    "HTTP": [
                        "Succeeded"
                    ]
                },
                "type": "ParseJson"
            }
        },
        "contentVersion": "1.0.0.0",
        "outputs": {},
        "parameters": {
            "$connections": {
                "defaultValue": {},
                "type": "Object"
            }
        },
        "triggers": {
            "Microsoft_Sentinel_incident": {
                "inputs": {
                    "body": {
                        "callback_url": "@{listCallbackUrl()}"
                    },
                    "host": {
                        "connection": {
                            "name": "@parameters('$connections')['azuresentinel']['connectionId']"
                        }
                    },
                    "path": "/incident-creation"
                },
                "type": "ApiConnectionWebhook"
            }
        }
    },
    "parameters": {
        "$connections": {
            "value": {
                "azuresentinel": {
                    "connectionId": "/subscriptions/1c61ccbf-70b3-45a3-a1fb-848ce46d70a6/resourceGroups/Admin/providers/Microsoft.Web/connections/azuresentinel-GeoSync-API",
                    "connectionName": "azuresentinel-GeoSync-API",
                    "connectionProperties": {
                        "authentication": {
                            "type": "ManagedServiceIdentity"
                        }
                    },
                    "id": "/subscriptions/1c61ccbf-70b3-45a3-a1fb-848ce46d70a6/providers/Microsoft.Web/locations/westus2/managedApis/azuresentinel"
                },
                "azuresentinel_1": {
                    "connectionId": "/subscriptions/1c61ccbf-70b3-45a3-a1fb-848ce46d70a6/resourceGroups/Admin/providers/Microsoft.Web/connections/azuresentinel-55",
                    "connectionName": "azuresentinel-55",
                    "id": "/subscriptions/1c61ccbf-70b3-45a3-a1fb-848ce46d70a6/providers/Microsoft.Web/locations/westus2/managedApis/azuresentinel"
                }
            }
        }
    }
}