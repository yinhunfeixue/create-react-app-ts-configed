// 类型命名 参考 try.thoughtspot.com

const Config = {
    'lzChart': {
        'Column': {
            'containerOption': {
                'tooltip': {
                    shared: false,
                }
            },
            'base': {

            }
        },
        'Bar': {
            'containerOption': {
                'tooltip': {
                    shared: false,
                }
            },
            'base': {
                'coord': {
                    'actions': [
                        ['transpose'],
                        [ 'scale', 1, -1 ]
                    ]
                }
            }
        },
        'StackedColumn': {
            'containerOption': {
                'tooltip': {
                    shared: false,
                }
            },
            'base': {

            }
        },
        'StackedBar': {
            'containerOption': {
                'tooltip': {
                    shared: false,
                }
            },
            'base': {
                'coord': {
                    'actions': [
                        ['transpose']
                    ]
                }
            }
        },
        'Line': {
            'containerOption': {
                'tooltip': {
                    shared: false,
                }
            },
            'base': {

            }
        },
        'Pie': {
            'base': {
                'coord': {
                    'type': 'theta',
                    'cfg': {
                        'radius': 0.75,
                        'innerRadius': 0.6
                    }
                },
            }
        },
        'Scatter': {
            'base': {

            }
        },
        'Bubble': {
            'base': {

            }
        },
        'PivotTable': {

        }
    },
    'antvChart': {
        'intervalStack': {

        },
        'line': {

        },
        'point': {

        },
    }
}

export default Config
