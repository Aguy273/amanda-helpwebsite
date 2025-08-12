"use client"

import { useState } from "react"
import { Search, X, Plus, Minus } from "lucide-react"
import { dummyFAQs } from "@/data/faqs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input" // Assuming shadcn/ui Input is available

export function FAQs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const filteredFAQs = dummyFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">FAQ'S</h2>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Enter question or topic here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* FAQ List */}
      <div className="space-y-0">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <Collapsible
              key={faq.id}
              open={openItems.has(faq.id)}
              onOpenChange={() => toggleItem(faq.id)}
              className="border-b border-gray-200 last:border-b-0"
            >
              <CollapsibleTrigger className="flex justify-between items-center w-full py-4 px-2 text-left text-gray-800 hover:bg-gray-50 transition-colors duration-200">
                <span className="font-medium text-base">{faq.question}</span>
                {openItems.has(faq.id) ? (
                  <Minus className="w-5 h-5 text-gray-600 transition-transform duration-200" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-600 transition-transform duration-200" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="pb-4 px-2 text-gray-600 text-sm data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                {faq.answer}
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">Tidak ada FAQ yang ditemukan.</div>
        )}
      </div>
    </div>
  )
}
