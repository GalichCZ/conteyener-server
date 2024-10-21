export type IsDocsUpdates = {
    change_type: string
    doc_name: string
    date: string
    comment_value: string
}

export type IsDocsNotification = {
    changes: IsDocsUpdates[]
    order_number: string
}