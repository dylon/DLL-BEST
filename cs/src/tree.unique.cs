/// Copyright (C) 2010 Dylon Edwards
/// 
/// This code is available under MIT License.
/// 
/// Permission is hereby granted, free of charge, to any person obtaining a copy
/// of this software and associated documentation files (the "Software"), to deal
/// in the Software without restriction, including without limitation the rights
/// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
/// copies of the Software, and to permit persons to whom the Software is
/// furnished to do so, subject to the following conditions:
/// 
/// The above copyright notice and this permission notice shall be included in
/// all copies or substantial portions of the Software.
/// 
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.

using System;
using CG = System.Collections.Generic;

namespace DllBest {

	/// <summary>
	/// Provides a base Tree class for all Doubly-Linked List, Binary Extended
	/// Search Tree classes. </summary>
	public abstract partial class Tree<T,N> : IRedundant<T,N>, IUnique<T,N>
		where N : Node<T,N>, new() {

		T ITree<T,N,IUnique<T,N>>.Get(int index, N node) {
			if (node == null) {
				return default (T);
			}

			int lc = 0;
			if (node.LChild != null) {
				lc = node.LChild.Children + 1;

				if (lc > index) {
					return Get(index, node.LChild);
				}
			}

			if (lc == index) {
				return node.Value;
			}

			return Get(index - lc - 1, node.RChild);
		}

		void ITree<T,N,IUnique<T,N>>.Insert(T value) {
			N node;

			if (Root == null) {
				node = new N();
				node.Value = value;
				Root = node;
			}

			if (Find(value) == null) {
				node = new N();
				node.Value = value;

				Add(Root, node);
				Elements += 1;
			}
		}

		void ITree<T,N,IUnique<T,N>>.PreOrder(N node, CG.List<T> list) {
			list.Add(node.Value);

			if (node.LChild != null) {
				PreOrder(node.LChild, list);
			}

			if (node.RChild != null) {
				PreOrder(node.RChild, list);
			}
		}

		void ITree<T,N,IUnique<T,N>>.InOrder(N node, CG.List<T> list) {
			if (node.LChild != null) {
				InOrder(node.LChild, list);
			}

			list.Add(node.Value);

			if (node.RChild != null) {
				InOrder(node.RChild, list);
			}
		}

		void ITree<T,N,IUnique<T,N>>.PostOrder(N node, CG.List<T> list) {
			if (node.LChild != null) {
				PostOrder(node.LChild, list);
			}

			if (node.RChild != null) {
				PostOrder(node.RChild, list);
			}

			list.Add(node.Value);
		}

		CG.List<T> ITree<T,N,IUnique<T,N>>.Range(T lower, T upper) {
			CG.List<T> range = new CG.List<T>();
			
			N curr = Root;

			while (curr != null) {
				int comp = Compare(curr.Value, lower);

				if (comp < 0) {
					curr = curr.RChild;
				}
				else if ((comp > 0) && (curr.LChild != null)) {
					curr = curr.LChild;
				}
				else {
					break;
				}
			}

			while ((curr != null) && (Compare(curr.Value, upper) <= 0)) {
				range.Add(curr.Value);
				curr = curr.Gt;
			}

			return range;
		}
	}
}

