{
  "targets": [
    {
      "target_name": "seccomp",
      "sources": [
        "seccomp.cc",
        "addon.cc",
        "noop.cc"
      ],
      "libraries": [
        "-lseccomp"
      ],
      'conditions': [
        ['OS!="linux"',
          {
            'sources/': [['exclude', 'seccomp.cc$']],
            'libraries/': [['exclude', '-lseccomp$']],
          }
        ],
        ['OS=="linux"',
          {
            'sources/': [['exclude', 'noop.cc$']]
          }
        ]
      ]
    }
  ]
}
