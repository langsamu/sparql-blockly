import * as Blockly from "blockly"

export const toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Queries",
            contents: [
                { kind: "label", text: "Query" },
                { kind: "block", type: "sparql11_query" },
                {
                    kind: "block",
                    type: "sparql11_prologueitem",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_base",
                                inputs: { value: { block: { type: "sparql11_iriref" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_prologueitem",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_prefixdecldefault",
                                inputs: { value: { block: { type: "sparql11_iriref" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_prologueitem",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_prefixdecl",
                                inputs: { value: { block: { type: "sparql11_iriref" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_selectquery",
                    inputs: {
                        select: {
                            block: {
                                type: "sparql11_selectclause",
                                inputs: { vars: { block: { type: "sparql11_varorexpressionasvaritem" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_expressionasvar",
                    inputs: { name: { block: { type: "sparql11_var1" } } }
                },
                { kind: "label", text: "Projection item" },
                { kind: "block", type: "sparql11_varorexpressionasvaritem" },
                {
                    kind: "block",
                    type: "sparql11_describequery",
                    inputs: { subject: { block: { type: "sparql11_varoririitem" } } }
                },
                { kind: "label", text: "Var / IRI item" },
                { kind: "block", type: "sparql11_varoririitem" },
                { kind: "block", type: "sparql11_askquery" },
                {
                    kind: "block",
                    type: "sparql11_simpleconstructquery",
                    inputs: { where: { block: { type: "sparql11_triplessamesubjectitem" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_constructquery",
                    inputs: { template: { block: { type: "sparql11_triplessamesubjectitem" } } }
                },
                { kind: "label", text: "Triples same subject item" },
                { kind: "block", type: "sparql11_triplessamesubjectitem" },
                {
                    kind: "block",
                    type: "sparql11_querycommon",
                    inputs: { pattern: { block: { type: "sparql11_groupgraphpattern" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_datasetclause",
                    inputs: { value: { block: { type: "sparql11_iriref" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_datasetclause",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_namedgraphclause",
                                inputs: { value: { block: { type: "sparql11_iriref" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_solutionmodifier",
                    inputs: {
                        group: { block: { type: "sparql11_groupconditionitem" } },
                        having: { block: { type: "sparql11_havingconditionitem" } },
                        order: { block: { type: "sparql11_orderconditionitem" } },
                        limit: { block: { type: "sparql11_numericliteral" } },
                        offset: { block: { type: "sparql11_numericliteral" } }
                    }
                },
                { kind: "label", text: "Group condition item" },
                { kind: "block", type: "sparql11_groupconditionitem" },
                { kind: "label", text: "Having condition item" },
                { kind: "block", type: "sparql11_havingconditionitem" },
                { kind: "label", text: "Order condition item" },
                { kind: "block", type: "sparql11_orderconditionitem" },
                {
                    kind: "block",
                    type: "sparql11_ordercondition",
                    inputs: { value: { block: { type: "sparql11_brackettedexpression" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_inlinedata",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_inlinedataonevar",
                                inputs: {
                                    variable: { block: { type: "sparql11_var1" } },
                                    values: {
                                        block: {
                                            type: "sparql11_datablockvalueitem",
                                            inputs: { value: { block: { type: "sparql11_undef" } } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                { kind: "label", text: "Data block value" },
                { kind: "block", type: "sparql11_datablockvalueitem" },
                {
                    kind: "block",
                    type: "sparql11_inlinedata",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_inlinedatafull",
                                inputs: {
                                    variables: {
                                        block: {
                                            type: "sparql11_varitem",
                                            inputs: { value: { block: { type: "sparql11_var1" } } },
                                            next: {
                                                block: {
                                                    type: "sparql11_varitem",
                                                    inputs: { value: { block: { type: "sparql11_var1" } } }
                                                }
                                            }
                                        }
                                    },
                                    values: {
                                        block: {
                                            type: "sparql11_datablockvaluesitem",
                                            inputs: {
                                                items: {
                                                    block: {
                                                        type: "sparql11_datablockvalueitem",
                                                        inputs: {
                                                            value: { block: { type: "sparql11_undef" } }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "sparql11_datablockvalueitem",
                                                                inputs: {
                                                                    value: {
                                                                        block: { type: "sparql11_undef" }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                { kind: "label", text: "Data block row" },
                { kind: "block", type: "sparql11_datablockvaluesitem" }
            ]
        },
        {
            kind: "category",
            name: "Patterns",
            contents: [
                { kind: "label", text: "Triples same subject" },
                {
                    kind: "block",
                    type: "sparql11_triplessamesubject",
                    inputs: {
                        predicates: {
                            block: {
                                type: "sparql11_propertylistnotempty",
                                inputs: { objects: { block: { type: "sparql11_objectlistitem" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_blanknodepropertylist",
                    inputs: {
                        predicates: {
                            block: {
                                type: "sparql11_propertylistnotempty",
                                inputs: { objects: { block: { type: "sparql11_objectlistitem" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_collection",
                    inputs: { items: { block: { type: "sparql11_graphnodeitem" } } }
                },
                { kind: "label", text: "Property list item" },
                {
                    kind: "block",
                    type: "sparql11_propertylistnotempty",
                    inputs: { objects: { block: { type: "sparql11_objectlistitem" } } }
                },
                { kind: "label", text: "Object list item" },
                { kind: "block", type: "sparql11_objectlistitem" },
                { kind: "label", text: "Object list item with annotation pattern" },
                {
                    kind: "block",
                    type: "sparql11_objectlistitemannotationpattern",
                    inputs: {
                        annotations: {
                            block: {
                                type: "sparql11_propertylistnotempty",
                                inputs: { objects: { block: { type: "sparql11_objectlistitem" } } }
                            }
                        }
                    }
                },
                { kind: "block", type: "sparql11_groupgraphpattern" },
                { kind: "label", text: "Group graph pattern sub" },
                {
                    kind: "block",
                    type: "sparql11_groupgraphpatternsub",
                    inputs: { items: { block: { type: "sparql11_groupgraphpatternsubitem" } } }
                },
                { kind: "label", text: "Pattern/subquery item" },
                { kind: "block", type: "sparql11_groupgraphpatternsubitem" },
                { kind: "label", text: "Subquery" },
                {
                    kind: "block",
                    type: "sparql11_subselect",
                    inputs: {
                        select: { block: { type: "sparql11_selectclause" } },
                        pattern: { block: { type: "sparql11_groupgraphpattern" } }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_bind",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_expressionasvar",
                                inputs: { name: { block: { type: "sparql11_var1" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_optionalgraphpattern",
                    inputs: { value: { block: { type: "sparql11_groupgraphpattern" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_graphgraphpattern",
                    inputs: { patterns: { block: { type: "sparql11_groupgraphpattern" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_servicegraphpattern",
                    inputs: { patterns: { block: { type: "sparql11_groupgraphpattern" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_minusgraphpattern",
                    inputs: { value: { block: { type: "sparql11_groupgraphpattern" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_grouporuniongraphpattern",
                    inputs: {
                        items: {
                            block: {
                                type: "sparql11_groupgraphpatternitem",
                                inputs: { value: { block: { type: "sparql11_groupgraphpattern" } } }
                            }
                        }
                    }
                },
                { kind: "label", text: "Union item" },
                { kind: "block", type: "sparql11_groupgraphpatternitem" },
                { kind: "block", type: "sparql11_filter" },
                {
                    kind: "block",
                    type: "sparql11_inlinedata",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_inlinedataonevar",
                                inputs: {
                                    variable: { block: { type: "sparql11_var1" } },
                                    values: {
                                        block: {
                                            type: "sparql11_datablockvalueitem",
                                            inputs: { value: { block: { type: "sparql11_undef" } } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                { kind: "label", text: "Data block value" },
                { kind: "block", type: "sparql11_datablockvalueitem" },
                {
                    kind: "block",
                    type: "sparql11_inlinedata",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_inlinedatafull",
                                inputs: {
                                    variables: {
                                        block: {
                                            type: "sparql11_varitem",
                                            inputs: { value: { block: { type: "sparql11_var1" } } },
                                            next: {
                                                block: {
                                                    type: "sparql11_varitem",
                                                    inputs: { value: { block: { type: "sparql11_var1" } } }
                                                }
                                            }
                                        }
                                    },
                                    values: {
                                        block: {
                                            type: "sparql11_datablockvaluesitem",
                                            inputs: {
                                                items: {
                                                    block: {
                                                        type: "sparql11_datablockvalueitem",
                                                        inputs: {
                                                            value: { block: { type: "sparql11_undef" } }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "sparql11_datablockvalueitem",
                                                                inputs: {
                                                                    value: {
                                                                        block: { type: "sparql11_undef" }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                { kind: "label", text: "Data block row" },
                { kind: "block", type: "sparql11_datablockvaluesitem" }
            ]
        },
        {
            kind: "category",
            name: "Terms",
            contents: [
                { kind: "block", type: "sparql11_var1" },
                { kind: "block", type: "sparql11_var2" },
                { kind: "block", type: "sparql11_irirefdefault" },
                { kind: "block", type: "sparql11_iriref" },
                { kind: "block", type: "sparql11_prefixedname" },
                { kind: "block", type: "sparql11_prefixednameprefix" },
                { kind: "block", type: "sparql11_prefixednamelocalname" },
                { kind: "block", type: "sparql11_prefixednameprefixlocalname" },
                { kind: "block", type: "sparql11_string", fields: { value: "lorem ipsum" } },
                { kind: "block", type: "sparql11_numericliteral", fields: { value: "42" } },
                { kind: "block", type: "sparql11_booleanliteral" },
                {
                    kind: "block",
                    type: "sparql11_typedliteral",
                    inputs: { value: { block: { type: "sparql11_string" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_langstring",
                    fields: { language: "en" },
                    inputs: { value: { block: { type: "sparql11_string" } } }
                },
                { kind: "block", type: "sparql11_blanknodelabel" },
                { kind: "block", type: "sparql11_anon" },
                { kind: "block", type: "sparql11_nil" },
                {
                    kind: "block",
                    type: "sparql11_blanknodepropertylist",
                    inputs: {
                        predicates: {
                            block: {
                                type: "sparql11_propertylistnotempty",
                                inputs: { objects: { block: { type: "sparql11_objectlistitem" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_collection",
                    inputs: { items: { block: { type: "sparql11_graphnodeitem" } } }
                },
                { kind: "label", text: "Property list item" },
                {
                    kind: "block",
                    type: "sparql11_propertylistnotempty",
                    inputs: { objects: { block: { type: "sparql11_objectlistitem" } } }
                },
                { kind: "label", text: "Object list item" },
                { kind: "block", type: "sparql11_objectlistitem" },
                { kind: "label", text: "Object list item with annotation pattern" },
                {
                    kind: "block",
                    type: "sparql11_objectlistitemannotationpattern",
                    inputs: {
                        annotations: {
                            block: {
                                type: "sparql11_propertylistnotempty",
                                inputs: { objects: { block: { type: "sparql11_objectlistitem" } } }
                            }
                        }
                    }
                },
                { kind: "block", type: "sparql11_embtp" },
                { kind: "block", type: "sparql11_tripleterm" },
                { kind: "block", type: "sparql11_tripletermdata" },
                { kind: "block", type: "sparql11_exprtripleterm" }
            ]
        },
        {
            kind: "category",
            name: "Verbs",
            contents: [
                { kind: "block", type: "sparql11_var1" },
                { kind: "block", type: "sparql11_var2" },
                { kind: "block", type: "sparql11_irirefdefault" },
                { kind: "block", type: "sparql11_iriref", fields: { value: "" } },
                { kind: "block", type: "sparql11_prefixedname" },
                { kind: "block", type: "sparql11_prefixednameprefix", fields: { prefix: "" } },
                { kind: "block", type: "sparql11_prefixednamelocalname", fields: { localName: "" } },
                {
                    kind: "block",
                    type: "sparql11_prefixednameprefixlocalname",
                    fields: { prefix: "", localName: "" }
                },
                { kind: "block", type: "sparql11_a" },
                { kind: "block", type: "sparql11_negatedpath" },
                { kind: "block", type: "sparql11_bracketedpath" },
                { kind: "block", type: "sparql11_pathwithmodifier", fields: { modifier: "" } },
                { kind: "block", type: "sparql11_inversepath" },
                {
                    kind: "block",
                    type: "sparql11_pathalternative",
                    inputs: { items: { block: { type: "sparql11_pathalternativeitem" } } }
                },
                { kind: "label", text: "Alternative path item" },
                { kind: "block", type: "sparql11_pathalternativeitem" },
                {
                    kind: "block",
                    type: "sparql11_pathsequence",
                    inputs: { items: { block: { type: "sparql11_pathsequencitem" } } }
                },
                { kind: "label", text: "Path sequence item" },
                { kind: "block", type: "sparql11_pathsequencitem" },
                { kind: "label", text: "Inverse path (in negated)" },
                { kind: "block", type: "sparql11_inversepathoneinpropertyset" },
                { kind: "label", text: "Alternative path (in negated)" },
                {
                    kind: "block",
                    type: "sparql11_pathoneinpropertysetalternative",
                    inputs: { items: { block: { type: "sparql11_pathoneinpropertysetalternativeitem" } } }
                },
                { kind: "label", text: "Alternative path (in negated) item" },
                { kind: "block", type: "sparql11_pathoneinpropertysetalternativeitem" }
            ]
        },
        {
            kind: "category",
            name: "Expressions",
            contents: [
                { kind: "block", type: "sparql11_conditionalorexpression" },
                { kind: "block", type: "sparql11_conditionalandexpression" },
                { kind: "block", type: "sparql11_relationalexpression" },
                {
                    kind: "block",
                    type: "sparql11_relationalexpressionin",
                    inputs: { right: { block: { type: "sparql11_expressionlistitem" } } }
                },
                { kind: "block", type: "sparql11_additiveexpression" },
                { kind: "block", type: "sparql11_multiplicativeexpression" },
                { kind: "block", type: "sparql11_unaryexpression" },
                { kind: "block", type: "sparql11_brackettedexpression" },
                { kind: "block", type: "sparql11_builtincall0" },
                { kind: "block", type: "sparql11_builtincall1" },
                { kind: "block", type: "sparql11_builtincall2" },
                { kind: "block", type: "sparql11_builtincall3" },
                { kind: "block", type: "sparql11_builtincall4" },
                {
                    kind: "block",
                    type: "sparql11_bound",
                    inputs: { value: { block: { type: "sparql11_var1" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_builtincalln",
                    inputs: { args: { block: { type: "sparql11_expressionlistitem" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_iriorfunction",
                    inputs: { args: { block: { type: "sparql11_expressionlistitem" } } }
                },
                { kind: "label", text: "Expression list item" },
                { kind: "block", type: "sparql11_expressionlistitem" },
                {
                    kind: "block",
                    type: "sparql11_exists",
                    inputs: { value: { block: { type: "sparql11_groupgraphpattern" } } }
                },
                { kind: "block", type: "sparql11_aggregate" },
                { kind: "block", type: "sparql11_count" },
                { kind: "block", type: "sparql11_group_concat" }
            ]
        },
        {
            kind: "category",
            name: "Update",
            contents: [
                { kind: "label", text: "Update" },
                {
                    kind: "block",
                    type: "sparql11_update",
                    inputs: { items: { block: { type: "sparql11_updateitem" } } }
                },
                { kind: "label", text: "Update item" },
                { kind: "block", type: "sparql11_updateitem" },
                {
                    kind: "block",
                    type: "sparql11_prologueitem",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_base",
                                inputs: { value: { block: { type: "sparql11_iriref" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_prologueitem",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_prefixdecldefault",
                                inputs: { value: { block: { type: "sparql11_iriref" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_prologueitem",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_prefixdecl",
                                inputs: { value: { block: { type: "sparql11_iriref" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_modify",
                    inputs: {
                        delete: {
                            block: {
                                type: "sparql11_quadpattern",
                                inputs: { items: { block: { type: "sparql11_quadpatternitem" } } }
                            }
                        },
                        insert: {
                            block: {
                                type: "sparql11_quadpattern",
                                inputs: { items: { block: { type: "sparql11_quadpatternitem" } } }
                            }
                        },
                        where: { block: { type: "sparql11_groupgraphpattern" } }
                    }
                },
                { kind: "label", text: "Quad pattern item" },
                { kind: "block", type: "sparql11_quadpatternitem" },
                {
                    kind: "block",
                    type: "sparql11_usingclause",
                    inputs: { value: { block: { type: "sparql11_iriref" } } }
                },
                {
                    kind: "block",
                    type: "sparql11_usingclause",
                    inputs: {
                        value: {
                            block: {
                                type: "sparql11_namedgraphclause",
                                inputs: {
                                    value: { block: { type: "sparql11_iriref", fields: { value: "" } } }
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_insertdeletewhere",
                    inputs: {
                        pattern: {
                            block: {
                                type: "sparql11_quadpattern",
                                inputs: { items: { block: { type: "sparql11_quadpatternitem" } } }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "sparql11_quadsnottriples",
                    inputs: { triples: { block: { type: "sparql11_triplessamesubjectitem" } } }
                },
                { kind: "label", text: "Triples same subject item" },
                { kind: "block", type: "sparql11_triplessamesubjectitem" },
                { kind: "block", type: "sparql11_load" },
                { kind: "block", type: "sparql11_cleardrop" },
                { kind: "block", type: "sparql11_create" },
                { kind: "block", type: "sparql11_addmovecopy" },
                { kind: "block", type: "sparql11_graphordefault" },
                { kind: "block", type: "sparql11_graphrefallall" },
                { kind: "block", type: "sparql11_graphrefallnamed" },
                { kind: "block", type: "sparql11_graphref" }
            ]
        },
        {
            kind: "category",
            name: "Vocabularies",
            contents: [
                {
                    kind: "category",
                    name: "RDF",
                    contents: [
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "rdf" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: {
                                                        value: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "HTML" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "langString" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "PlainLiteral" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "type" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "Property" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "Statement" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "subject" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "predicate" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "object" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "Bag" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "Seq" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "Alt" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "value" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "List" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "nil" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "XMLLiteral" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "JSON" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "CompoundLiteral" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "language" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdf", localName: "direction" }
                        },
                        { kind: "block", type: "sparql11_faketallblock", enabled: false }
                    ]
                },
                {
                    kind: "category",
                    name: "XSD",
                    contents: [
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "xsd" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: { value: "http://www.w3.org/2001/XMLSchema#" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "integer" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "decimal" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "float" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "double" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "string" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "boolean" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "dateTime" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "nonPositiveInteger" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "negativeInteger" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "long" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "int" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "short" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "byte" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "nonNegativeInteger" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "unsignedLong" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "unsignedInt" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "unsignedShort" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "unsignedByte" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "xsd", localName: "positiveInteger" }
                        },
                        { kind: "block", type: "sparql11_faketallblock", enabled: false }
                    ]
                },
                {
                    kind: "category",
                    name: "RDFS",
                    contents: [
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "rdfs" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: {
                                                        value: "http://www.w3.org/2000/01/rdf-schema#"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "integer" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "Resource" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "Class" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "subClassOf" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "subPropertyOf" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "comment" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "label" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "domain" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "range" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "seeAlso" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "isDefinedBy" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "Literal" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "Container" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "ContainerMembershipProperty" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "member" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "rdfs", localName: "Datatype" }
                        },
                        { kind: "block", type: "sparql11_faketallblock", enabled: false }
                    ]
                },
                {
                    kind: "category",
                    name: "SKOS",
                    contents: [
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "skos" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: {
                                                        value: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "Collection" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "Concept" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "ConceptScheme" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "OrderedCollection" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "altLabel" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "broadMatch" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "broader" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "broaderTransitive" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "changeNote" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "closeMatch" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "definition" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "editorialNote" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "exactMatch" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "example" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "hasTopConcept" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "hiddenLabel" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "historyNote" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "inScheme" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "mappingRelation" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "member" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "memberList" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "narrowMatch" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "narrower" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "narrowerTransitive" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "notation" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "note" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "prefLabel" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "related" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "relatedMatch" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "scopeNote" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "semanticRelation" }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prefixednameprefixlocalname",
                            fields: { prefix: "skos", localName: "topConceptOf" }
                        },
                        { kind: "block", type: "sparql11_faketallblock", enabled: false }
                    ]
                },
                {
                    kind: "category",
                    name: "Other prefixes",
                    contents: [
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "dc" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: { value: "http://purl.org/dc/terms/" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "dcat" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: { value: "http://www.w3.org/ns/dcat#" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "ex" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: { value: "http://example.com/" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "foaf" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: { value: "http://xmlns.com/foaf/0.1/" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "org" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: { value: "http://www.w3.org/ns/org#" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "owl" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: { value: "http://www.w3.org/2002/07/owl#" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "prov" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: { value: "http://www.w3.org/ns/prov#" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "shacl" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: { value: "http://www.w3.org/ns/shacl#" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            kind: "block",
                            type: "sparql11_prologueitem",
                            inputs: {
                                value: {
                                    block: {
                                        type: "sparql11_prefixdecl",
                                        fields: { prefix: "void" },
                                        inputs: {
                                            value: {
                                                block: {
                                                    type: "sparql11_iriref",
                                                    fields: { value: "http://rdfs.org/ns/void#" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        { kind: "block", type: "sparql11_faketallblock", enabled: false }
                    ]
                }
            ]
        },
        {
            kind: "category",
            name: "Examples",
            contents: [
                {
                    kind: "button",
                    text: "SELECT *",
                    callbackKey: "example",
                    query: "SELECT *\r\nWHERE {\r\n\t?s ?p ?o\r\n}"
                },
                {
                    kind: "button",
                    text: "RDFS: Property details",
                    callbackKey: "example",
                    query: "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n\r\nCONSTRUCT {\r\n\t?property\r\n\t\trdfs:isDefinedBy ?label ;\r\n\t\trdfs:label ?label ;\r\n\t\trdfs:comment ?comment ;\r\n\t\trdfs:domain ?domain ;\r\n\t\trdfs:range ?range ;\r\n\t\trdfs:subPropertyOf ?superProperty .\r\n\t?subProperty rdfs:subPropertyOf ?property\r\n}\r\nWHERE {\r\n\t?property a rdf:Property .\r\n\tOPTIONAL {\r\n\t\t?property rdfs:isDefinedBy ?label\r\n\t} .\r\n\tOPTIONAL {\r\n\t\t?property rdfs:label ?label\r\n\t} .\r\n\tOPTIONAL {\r\n\t\t?property rdfs:comment ?comment\r\n\t} .\r\n\tOPTIONAL {\r\n\t\t?property rdfs:domain ?domain\r\n\t} .\r\n\tOPTIONAL {\r\n\t\t?property rdfs:range ?range\r\n\t} .\r\n\tOPTIONAL {\r\n\t\t?property rdfs:subPropertyOf ?superProperty\r\n\t} .\r\n\tOPTIONAL {\r\n\t\t?property ^rdfs:subPropertyOf ?subProperty\r\n\t}\r\n}"
                },
                {
                    kind: "button",
                    text: "SKOS: Collection details",
                    callbackKey: "example",
                    query: "# See https://github.com/ukparliament/VocabularyBrowser/blob/master/VocabularyBrowser/Controllers/CollectionController.cs#L51\r\n\r\nPREFIX : <urn:>\r\nPREFIX skos: <http://www.w3.org/2004/02/skos/core#>\r\n\r\nCONSTRUCT {\r\n\t?collection\r\n\t\t:selected true ;\r\n\t\ta skos:Collection ;\r\n\t\tskos:prefLabel ?collectionLabel ;\r\n\t\tskos:member ?concept, ?child .\r\n\t?concept\r\n\t\ta skos:Concept ;\r\n\t\tskos:prefLabel ?conceptLabel .\r\n\t?parent\r\n\t\ta skos:Collection ;\r\n\t\tskos:member ?collection ;\r\n\t\tskos:prefLabel ?parentLabel .\r\n\t?child\r\n\t\ta skos:Collection ;\r\n\t\tskos:prefLabel ?childLabel\r\n}\r\nWHERE {\r\n\tBIND (?parameter AS ?collection) .\r\n\t?collection skos:prefLabel ?collectionPrefLabel .\r\n\tBIND (STR(?collectionPrefLabel) AS ?collectionLabel) .\r\n\tOPTIONAL {\r\n\t\t?concept\r\n\t\t\ta skos:Concept ;\r\n\t\t\t^skos:member ?collection ;\r\n\t\t\tskos:prefLabel ?conceptPrefLabel .\r\n\t\tBIND (STR(?conceptPrefLabel) AS ?conceptLabel)\r\n\t} .\r\n\tOPTIONAL {\r\n\t\t?parent\r\n\t\t\ta skos:Collection ;\r\n\t\t\tskos:member ?collection ;\r\n\t\t\tskos:prefLabel ?parentPrefLabel .\r\n\t\tBIND (STR(?parentPrefLabel) AS ?parentLabel)\r\n\t} .\r\n\tOPTIONAL {\r\n\t\t?child\r\n\t\t\ta skos:Collection ;\r\n\t\t\t^skos:member ?collection ;\r\n\t\t\tskos:prefLabel ?childPrefLabel .\r\n\t\tBIND (STR(?childPrefLabel) AS ?childLabel)\r\n\t}\r\n}"
                },
                {
                    kind: "button",
                    text: "Class popularity",
                    callbackKey: "example",
                    query: "SELECT ?class (COUNT(?resource) AS ?count)\r\nWHERE {\r\n\t?resource a ?class .\r\n}\r\nGROUP BY ?class\r\nORDER BY DESC(COUNT(?resource))\r\nLIMIT 10"
                },
                {
                    kind: "button",
                    text: "Wikidata: Oscars/type",
                    callbackKey: "example",
                    query: "# See https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/queries/examples#Number_of_handed_out_academy_awards_per_award_type\r\n\r\nBASE <http://www.wikidata.org/>\r\nPREFIX p: <prop/>\r\nPREFIX pq: <prop/qualifier/>\r\nPREFIX ps: <prop/statement/>\r\nPREFIX wdt: <prop/direct/>\r\nPREFIX wd: <entity/>\r\nPREFIX bd: <http://www.bigdata.com/rdf#>\r\nPREFIX wikibase: <http://wikiba.se/ontology#>\r\n\r\nSELECT ?awardCount ?award ?awardLabel\r\nWHERE {\r\n\t{\r\n\t\tSELECT (COUNT(?award) AS ?awardCount) ?award\r\n\t\tWHERE {\r\n\t\t\t{\r\n\t\t\t\tSELECT (SAMPLE(?human) AS ?human) ?award ?awardWork (SAMPLE(?director) AS ?director) (SAMPLE(?awardEdition) AS ?awardEdition) (SAMPLE(?time) AS ?time)\r\n\t\t\t\tWHERE {\r\n\t\t\t\t\t?award wdt:P31 wd:Q19020 .\r\n\t\t\t\t\t{\r\n\t\t\t\t\t\t?human\r\n\t\t\t\t\t\t\tp:P166 ?awardStat ;\r\n\t\t\t\t\t\t\twdt:P31 wd:Q5 .\r\n\t\t\t\t\t\t?awardStat\r\n\t\t\t\t\t\t\tps:P166 ?award ;\r\n\t\t\t\t\t\t\tpq:P805 ?awardEdition ;\r\n\t\t\t\t\t\t\tpq:P1686 ?awardWork\r\n\t\t\t\t\t}\r\n\t\t\t\t\tUNION\r\n\t\t\t\t\t{\r\n\t\t\t\t\t\t?awardWork\r\n\t\t\t\t\t\t\twdt:P31 wd:Q11424 ;\r\n\t\t\t\t\t\t\tp:P166 ?awardStat .\r\n\t\t\t\t\t\t?awardStat\r\n\t\t\t\t\t\t\tps:P166 ?award ;\r\n\t\t\t\t\t\t\tpq:P805 ?awardEdition\r\n\t\t\t\t\t} .\r\n\t\t\t\t\tOPTIONAL {\r\n\t\t\t\t\t\t?awardEdition wdt:P585 ?time .\r\n\t\t\t\t\t\t?awardWork wdt:P57 ?director\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t\tGROUP BY ?awardWork ?award\r\n\t\t\t}\r\n\t\t}\r\n\t\tGROUP BY ?award\r\n\t\tORDER BY ?awardCount\r\n\t} .\r\n\tSERVICE wikibase:label {\r\n\t\tbd:serviceParam wikibase:language '[AUTO_LANGUAGE],en'\r\n\t}\r\n}"
                },
                {
                    kind: "button",
                    text: "UK Parliament: Procedure",
                    callbackKey: "example",
                    query: "# See https://github.com/ukparliament/Query/blob/master/Parliament.Data.Api.FixedQuery/Sparql/work_package_by_id.sparql\r\n\r\nPREFIX ex: <https://example.com/>\r\nPREFIX : <https://id.parliament.uk/schema/>\r\n\r\nCONSTRUCT {\r\n\t?package\r\n\t\ta :WorkPackage ;\r\n\t\t:workPackageHasWorkPackageableThing ?workPackaged ;\r\n\t\t:workPackageHasProcedure ?procedure ;\r\n\t\t:workPackageHasBusinessItem ?item .\r\n\t?workPackaged\r\n\t\ta :WorkPackageableThing, ?class ;\r\n\t\t:workPackageableThingName ?workPackagedThingName ;\r\n\t\t:workPackageableThingHasWorkPackageableThingWebLink ?workPackagedLink .\r\n\t?procedure\r\n\t\ta :Procedure ;\r\n\t\t:procedureName ?procedureName .\r\n\t?item\r\n\t\ta :BusinessItem ;\r\n\t\t:businessItemHasProcedureStep ?step ;\r\n\t\t:businessItemDate ?itemDate ;\r\n\t\t:businessItemHasBusinessItemWebLink ?itemLink .\r\n\t?step\r\n\t\ta :ProcedureStep, ex:Actualized ;\r\n\t\t:procedureStepName ?stepName ;\r\n\t\t:procedureStepHasHouse ?house ;\r\n\t\t:procedureStepHasBusinessItem ?item ;\r\n\t\tex:ledTo ?otherStep ;\r\n\t\tex:canLeadTo ?otherStep .\r\n\t?enablingStep\r\n\t\tex:enables ?possibleStep ;\r\n\t\tex:canLeadTo ?possibleStep .\r\n\t?possibleStep\r\n\t\ta :ProcedureStep, ex:Possible ;\r\n\t\t:procedureStepName ?possibleName ;\r\n\t\t:procedureStepHasHouse ?possibleHouse .\r\n\t?rootStep a ex:Root .\r\n\t?house\r\n\t\ta :House ;\r\n\t\t:houseName ?houseName .\r\n\t?possibleHouse\r\n\t\ta :House ;\r\n\t\t:houseName ?possibleHouseName\r\n}\r\nWHERE {\r\n\tBIND (?work_package_id AS ?package) .\r\n\t?package :workPackageHasProcedure ?procedure .\r\n\t?procedure :procedureName ?procedureName .\r\n\tOPTIONAL {\r\n\t\t?package :workPackageHasWorkPackagedThing ?workPackaged .\r\n\t\t?workPackaged a ?class .\r\n\t\tFILTER ((?class = :StatutoryInstrumentPaper || ?class = :ProposedNegativeStatutoryInstrumentPaper) || ?class = :Treaty) .\r\n\t\tOPTIONAL {\r\n\t\t\t?workPackaged :workPackagedThingName ?workPackagedThingName\r\n\t\t} .\r\n\t\tOPTIONAL {\r\n\t\t\t?workPackaged :workPackagedThingHasWorkPackagedThingWebLink ?workPackagedLink\r\n\t\t}\r\n\t} .\r\n\tOPTIONAL {\r\n\t\t{\r\n\t\t\t?enablingStep :procedureStepHasBusinessItem/:businessItemHasWorkPackage ?package .\r\n\t\t\t?possibleRoute\r\n\t\t\t\t:procedureRouteHasProcedure ?procedure ;\r\n\t\t\t\t:procedureRouteIsFromProcedureStep ?enablingStep ;\r\n\t\t\t\t:procedureRouteIsToProcedureStep ?possibleStep .\r\n\t\t\t?possibleStep :procedureStepName ?possibleName .\r\n\t\t\tOPTIONAL {\r\n\t\t\t\t?possibleStep :procedureStepHasHouse ?possibleHouse .\r\n\t\t\t\t?possibleHouse :houseName ?possibleHouseName\r\n\t\t\t} .\r\n\t\t\tFILTER NOT EXISTS {\r\n\t\t\t\t?possibleStep :procedureStepHasBusinessItem/:businessItemHasWorkPackage ?package\r\n\t\t\t} .\r\n\t\t\tFILTER NOT EXISTS {\r\n\t\t\t\t?precludingRoute\r\n\t\t\t\t\t:procedureRouteHasProcedure ?procedure ;\r\n\t\t\t\t\t:procedureRouteIsToProcedureStep ?possibleStep ;\r\n\t\t\t\t\t:precludedProcedureRouteIsPrecludedByProcedureStep/:procedureStepHasBusinessItem/:businessItemHasWorkPackage ?package\r\n\t\t\t} .\r\n\t\t\tFILTER NOT EXISTS {\r\n\t\t\t\t?requiringRoute\r\n\t\t\t\t\t:procedureRouteHasProcedure ?procedure ;\r\n\t\t\t\t\t:requiredProcedureRouteIsRequiredByProcedureStep ?possibleStep .\r\n\t\t\t\tFILTER NOT EXISTS {\r\n\t\t\t\t\t?requiringRoute :procedureRouteIsToProcedureStep/:procedureStepHasBusinessItem/:businessItemHasWorkPackage ?package\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t\tUNION\r\n\t\t{\r\n\t\t\t?item :businessItemHasWorkPackage ?package .\r\n\t\t\t?package :workPackageHasProcedure ?procedure .\r\n\t\t\tOPTIONAL {\r\n\t\t\t\t?item :businessItemDate ?itemDate\r\n\t\t\t} .\r\n\t\t\tOPTIONAL {\r\n\t\t\t\t?item :businessItemHasBusinessItemWebLink ?itemLink\r\n\t\t\t} .\r\n\t\t\t?step\r\n\t\t\t\t:procedureStepHasBusinessItem ?item ;\r\n\t\t\t\t:procedureStepName ?stepName .\r\n\t\t\tOPTIONAL {\r\n\t\t\t\t?step :procedureStepHasHouse ?house .\r\n\t\t\t\t?house :houseName ?houseName\r\n\t\t\t} .\r\n\t\t\tOPTIONAL {\r\n\t\t\t\t?actualizedRoute\r\n\t\t\t\t\t:procedureRouteHasProcedure ?procedure ;\r\n\t\t\t\t\t:causedProcedureRouteIsCausedByProcedureStep|:allowedProcedureRouteIsAllowedByProcedureStep ?step ;\r\n\t\t\t\t\t:procedureRouteIsToProcedureStep ?otherStep .\r\n\t\t\t\t?otherStep :procedureStepHasBusinessItem/:businessItemHasWorkPackage ?package .\r\n\t\t\t\tFILTER (?otherStep != ?step)\r\n\t\t\t}\r\n\t\t}\r\n\t\tUNION\r\n\t\t{\r\n\t\t\t?rootStep :procedureStepHasBusinessItem/:businessItemHasWorkPackage ?package .\r\n\t\t\tOPTIONAL {\r\n\t\t\t\t?higherRoute\r\n\t\t\t\t\t:procedureRouteHasProcedure ?procedure ;\r\n\t\t\t\t\t(:causedProcedureRouteIsCausedByProcedureStep|:allowedProcedureRouteIsAllowedByProcedureStep)/:procedureStepHasBusinessItem/:businessItemHasWorkPackage ?package ;\r\n\t\t\t\t\t:procedureRouteIsToProcedureStep ?rootStep\r\n\t\t\t} .\r\n\t\t\tFILTER (!BOUND(?higherRoute))\r\n\t\t}\r\n\t}\r\n}"
                },
                {
                    kind: "button",
                    text: "EU ODP: Dataset with title",
                    callbackKey: "example",
                    query: "# See https://data.europa.eu/euodp/en/Sample_SPARQL_queries#ODP-Developerscorner-SampleSPARQLqueries-Retrievedatasetwithspecifictitle(eg.'RegisterofCommissiondocuments')\r\n\r\nPREFIX dcat: <http://www.w3.org/ns/dcat#>\r\nPREFIX odp: <http://data.europa.eu/euodp/ontologies/ec-odp#>\r\nPREFIX dc: <http://purl.org/dc/terms/>\r\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\r\nPREFIX foaf: <http://xmlns.com/foaf/0.1/>\r\n\r\nSELECT ?Graph ?DatasetTitle ?Publisher ?DatasetURI\r\nWHERE {\r\n\tGRAPH ?Graph {\r\n\t\t?DatasetURI\r\n\t\t\ta dcat:Dataset ;\r\n\t\t\tdc:publisher ?Publisher ;\r\n\t\t\tdc:title ?DatasetTitle .\r\n\t\tFILTER REGEX(?DatasetTitle, 'Register of Commission documents', 'i')\r\n\t}\r\n}\r\nLIMIT 10"
                },
                {
                    kind: "button",
                    text: "GraphDB: SPARQL*",
                    callbackKey: "example",
                    query: "# See https://graphdb.ontotext.com/documentation/9.2/free/devhub/rdf-sparql-star.html\r\n\r\nPREFIX foaf: <http://xmlns.com/foaf/0.1/>\r\nPREFIX ex: <http://example.com/>\r\n\r\nSELECT ?p ?a ?c\r\nWHERE {\r\n\tBIND (<<( ?p foaf:age ?a )>> AS ?t) .\r\n\t?t ex:certainty ?c\r\n}"
                },
                {
                    kind: "button",
                    text: "Virtuoso: Insert example",
                    callbackKey: "example",
                    query: "# See http://vos.openlinksw.com/owiki/wiki/VOS/VirtTipsAndTricksSPARQL11Insert#INSERT%20%28Informative%29%20Examples\r\n\r\nBASE <http://example.com>\r\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\r\n\r\nINSERT DATA {\r\n\tGRAPH <urn:sparql:tests:insert:informative> {\r\n\t\t<#book1>\r\n\t\t\t<http://purl.org/dc/elements/1.1/title> 'Fundamentals of Compiler Design' ;\r\n\t\t\t<http://purl.org/dc/elements/1.1/date> '1977-01-01T00:00:00-02:00'^^xsd:dateTime .\r\n\t\t<#book2>\r\n\t\t\t<#price> 42 ;\r\n\t\t\t<http://purl.org/dc/elements/1.1/title> 'David Copperfield' ;\r\n\t\t\t<http://purl.org/dc/elements/1.1/creator> 'Edmund Wells' ;\r\n\t\t\t<http://purl.org/dc/elements/1.1/date> '1948-01-01T00:00:00-02:00'^^xsd:dateTime\r\n\t}\r\n} ;\r\n\r\nINSERT DATA {\r\n\tGRAPH <urn:sparql:tests:insert:informative2> {\r\n\t\t<#book4> <http://purl.org/dc/elements/1.1/title> 'SPARQL 1.0 Tutorial'\r\n\t}\r\n} ;\r\n\r\nINSERT {\r\n\tGRAPH <urn:sparql:tests:insert:informative2> {\r\n\t\t?book ?p ?v\r\n\t}\r\n}\r\nWHERE {\r\n\tGRAPH <urn:sparql:tests:insert:informative> {\r\n\t\t?book <http://purl.org/dc/elements/1.1/date> ?date .\r\n\t\tFILTER (?date > '1970-01-01T00:00:00-02:00'^^xsd:dateTime) .\r\n\t\t?book ?p ?v\r\n\t}\r\n}"
                },
                { kind: "block", type: "sparql11_faketallblock", enabled: false }
            ]
        },
        {
            kind: "category",
            name: "Execute",
            contents: [
                {
                    kind: "button",
                    text: "DBpedia",
                    callbackKey: "execute",
                    endpoint: "https://dbpedia.org/sparql?query="
                },
                {
                    kind: "button",
                    text: "Yasgui",
                    callbackKey: "execute",
                    endpoint: "https://yasgui.triply.cc/#query="
                },
                {
                    kind: "button",
                    text: "UK Parliament",
                    callbackKey: "execute",
                    endpoint: "https://api.parliament.uk/sparql#query="
                },
                {
                    kind: "button",
                    text: "EU ODP",
                    callbackKey: "execute",
                    endpoint: "https://data.europa.eu/euodp/en/linked-data#query="
                },
                {
                    kind: "button",
                    text: "Wikidata",
                    callbackKey: "execute",
                    endpoint: "https://query.wikidata.org/#"
                },
                {
                    kind: "button",
                    text: "URIBurner",
                    callbackKey: "execute",
                    endpoint: "http://uriburner.com/sparql?query="
                },
                { kind: "block", type: "sparql11_faketallblock", enabled: false }
            ]
        }
    ]
} as Blockly.utils.toolbox.ToolboxDefinition
