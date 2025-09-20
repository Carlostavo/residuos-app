import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { slug } = params

    const { data: elements, error } = await supabase.from("page_elements").select("*").eq("page_slug", slug)

    if (error) {
      console.error("[v0] Error fetching page elements:", error)
      return NextResponse.json({ elements: {} })
    }

    // Convert array to object with element_id as key
    const elementsObj = {}
    elements.forEach((element) => {
      elementsObj[element.element_id] = {
        type: element.type,
        content: element.content,
        x: element.position?.x || 0,
        y: element.position?.y || 0,
        style: element.styles || {},
        ...(element.properties || {}),
      }
    })

    return NextResponse.json({ elements: elementsObj })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ elements: {} })
  }
}

export async function POST(request, { params }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { slug } = params
    const { elements } = await request.json()

    // Delete existing elements for this page
    await supabase.from("page_elements").delete().eq("page_slug", slug)

    // Insert new elements
    const elementsToInsert = Object.entries(elements).map(([elementId, element]) => ({
      page_slug: slug,
      element_id: elementId,
      type: element.type,
      content: element.content || "",
      position: { x: element.x || 0, y: element.y || 0 },
      styles: element.style || {},
      properties: {
        ...element,
        type: undefined,
        content: undefined,
        x: undefined,
        y: undefined,
        style: undefined,
      },
    }))

    if (elementsToInsert.length > 0) {
      const { error } = await supabase.from("page_elements").insert(elementsToInsert)

      if (error) {
        console.error("[v0] Error saving elements:", error)
        return NextResponse.json({ success: false }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
